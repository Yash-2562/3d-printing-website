<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Cart.php';
require_once __DIR__ . '/../support/DatabaseSetup.php';
require_once __DIR__ . '/../services/NotificationService.php';

function listCustomerOrders(string $userId): void
{
    ensureCustomRequestsTable();
    ensurePaymentsTable();
    ensureRefundsTable();
    $statement = db()->prepare('SELECT o.id AS _id, o.total, o.status, o.shipping_address AS shippingAddress, DATE_FORMAT(o.created_at, "%d %b %Y, %h:%i %p") AS createdAt, COALESCE(SUM(oi.quantity), MAX(cr.quantity), 0) AS items, GROUP_CONCAT(CONCAT(oi.product_title, " x", oi.quantity) SEPARATOR ", ") AS orderItems, MAX(cr.id) AS customRequestId, MAX(cr.file_name) AS customFileName, MAX(cr.file_url) AS customFileUrl, MAX(cr.file_type) AS customFileType, MAX(cr.print_type) AS customPrintType, MAX(cr.size) AS customSize, MAX(cr.material) AS customMaterial, MAX(cr.color) AS customColor, MAX(cr.quantity) AS customQuantity, MAX(cr.notes) AS customNotes, MAX(cr.status) AS customStatus, MAX(p.status) AS paymentStatus, MAX(p.razorpay_order_id) AS razorpayOrderId, MAX(p.razorpay_payment_id) AS razorpayPaymentId, (SELECT COALESCE(SUM(r.amount), 0) FROM refunds r WHERE r.order_id = o.id AND r.status = "SUCCESSFUL") AS refundedAmount FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN custom_requests cr ON cr.order_id = o.id LEFT JOIN payments p ON p.order_id = o.id WHERE o.user_id = ? GROUP BY o.id, o.total, o.status, o.shipping_address, o.created_at ORDER BY o.created_at DESC');
    $statement->execute([$userId]);
    $orders = $statement->fetchAll();
    if ($orders) {
        $orderIds = array_column($orders, '_id');
        $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
        $itemsStatement = db()->prepare("SELECT oi.order_id AS orderId, oi.product_id AS productId, oi.product_title AS title, oi.quantity FROM order_items oi WHERE oi.order_id IN ($placeholders) ORDER BY oi.product_title");
        $itemsStatement->execute($orderIds);
        $itemsByOrder = [];
        foreach ($itemsStatement->fetchAll() as $item) $itemsByOrder[$item['orderId']][] = $item;
        foreach ($orders as &$order) $order['orderItemDetails'] = $itemsByOrder[$order['_id']] ?? [];
        unset($order);
    }
    respond(['data' => $orders]);
}

function createCheckoutSession(string $userId): void
{
    $cart = cartFor($userId);
    if (!$cart['products']) respond(['message' => 'Your cart is empty'], 422);
    $input = body();
    $shippingAddress = trim(implode(', ', array_filter([$input['details'] ?? '', $input['city'] ?? '', $input['phone'] ?? ''])));
    if ($shippingAddress === '') respond(['message' => 'Shipping address is required'], 422);
    if (RAZORPAY_KEY_ID === '' || RAZORPAY_KEY_SECRET === '') respond(['message' => 'Razorpay test keys are not configured. Add them to backend/.env'], 503);

    ensureOrderStatuses();
    $pdo = db();
    $pdo->beginTransaction();
    do { $orderId = '#PF-' . random_int(1000, 9999); $exists = $pdo->prepare('SELECT COUNT(*) FROM orders WHERE id = ?'); $exists->execute([$orderId]); } while ((int) $exists->fetchColumn() > 0);
    $pdo->prepare('INSERT INTO orders (id, user_id, total, shipping_address) VALUES (?, ?, ?, ?)')->execute([$orderId, $userId, $cart['totalCartPrice'], $shippingAddress]);
    $itemStatement = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_title, price, quantity) VALUES (?, ?, ?, ?, ?)');
    foreach ($cart['products'] as $item) $itemStatement->execute([$orderId, $item['product']['_id'], $item['product']['title'], $item['price'], $item['count']]);
    $pdo->commit();

    ensurePaymentsTable();
    $razorpayOrder = razorpayRequest('POST', '/orders', ['amount' => (int) round((float) $cart['totalCartPrice'] * 100), 'currency' => 'INR', 'receipt' => substr(preg_replace('/[^A-Za-z0-9]/', '', $orderId), 0, 40), 'notes' => ['local_order_id' => $orderId, 'user_id' => $userId]]);
    db()->prepare('INSERT INTO payments (id, order_id, user_id, amount, method, status, razorpay_order_id, razorpay_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')->execute(['payment-' . bin2hex(random_bytes(6)), $orderId, $userId, $cart['totalCartPrice'], 'Razorpay', 'PENDING', $razorpayOrder['id'], '']);
    respond(['status' => 'checkout_pending', 'orderId' => $orderId, 'payment' => ['gateway' => 'razorpay', 'status' => 'PENDING', 'keyId' => RAZORPAY_KEY_ID, 'razorpayOrderId' => $razorpayOrder['id'], 'amount' => (int) $razorpayOrder['amount'], 'currency' => $razorpayOrder['currency']], 'message' => 'Razorpay checkout created', 'cartId' => $cart['_id']]);
}

function verifyCustomerPayment(string $userId): void
{
    $input = body();
    $orderId = trim((string) ($input['orderId'] ?? ''));
    $razorpayOrderId = trim((string) ($input['razorpay_order_id'] ?? ''));
    $razorpayPaymentId = trim((string) ($input['razorpay_payment_id'] ?? ''));
    $signature = trim((string) ($input['razorpay_signature'] ?? ''));
    if ($orderId === '' || $razorpayOrderId === '' || $razorpayPaymentId === '' || $signature === '') respond(['message' => 'Incomplete Razorpay payment response'], 422);
    $statement = db()->prepare('SELECT id, amount, razorpay_order_id FROM payments WHERE order_id = ? AND user_id = ?');
    $statement->execute([$orderId, $userId]);
    $payment = $statement->fetch();
    $expected = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, RAZORPAY_KEY_SECRET);
    if (!$payment || !hash_equals($expected, $signature) || !hash_equals($payment['razorpay_order_id'], $razorpayOrderId)) respond(['message' => 'Razorpay payment verification failed'], 422);
    db()->prepare('UPDATE payments SET status = "SUCCESSFUL", razorpay_payment_id = ? WHERE id = ?')->execute([$razorpayPaymentId, $payment['id']]);
    $cart = cartFor($userId);
    db()->prepare('DELETE FROM cart_items WHERE cart_id = ?')->execute([$cart['_id']]);
    createNotification($userId, $orderId, 'PAYMENT_VERIFIED', 'Payment verified and order waiting for confirmation');
    respond(['status' => 'success', 'payment' => ['gateway' => 'razorpay', 'status' => 'SUCCESSFUL', 'razorpayOrderId' => $razorpayOrderId, 'razorpayPaymentId' => $razorpayPaymentId], 'message' => 'Payment verified successfully']);
}
