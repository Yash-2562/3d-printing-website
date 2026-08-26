<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';
require_once __DIR__ . '/../../services/NotificationService.php';

function adminPayments(): void
{
    ensurePaymentsTable();
    $statement = db()->query('SELECT p.id, p.order_id AS `order`, u.name AS customer, p.amount, p.method, p.status, p.razorpay_order_id AS razorpayOrder, p.razorpay_payment_id AS razorpayPayment, DATE_FORMAT(p.created_at, "%d %b %Y") AS date FROM payments p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC');
    respond(['data' => $statement->fetchAll()]);
}

function adminRefunds(): void
{
    ensureRefundsTable();
    $refunds = db()->query('SELECT r.id, r.order_id AS `order`, u.name AS customer, r.amount, r.reason, r.status, r.razorpay_refund_id AS razorpay, DATE_FORMAT(r.created_at, "%d %b %Y, %h:%i %p") AS date FROM refunds r JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC')->fetchAll();
    $orders = db()->query('SELECT p.order_id AS id, u.name AS customer, p.amount, COALESCE(SUM(r.amount), 0) AS refunded FROM payments p JOIN users u ON u.id = p.user_id LEFT JOIN refunds r ON r.payment_id = p.id AND r.status = "SUCCESSFUL" WHERE p.status = "SUCCESSFUL" GROUP BY p.id, p.order_id, u.name, p.amount HAVING p.amount > COALESCE(SUM(r.amount), 0) ORDER BY p.created_at DESC')->fetchAll();
    foreach ($orders as &$order) {
        $order['amount'] = (float) $order['amount'];
        $order['refunded'] = (float) $order['refunded'];
        $order['remaining'] = $order['amount'] - $order['refunded'];
    }
    unset($order);
    respond(['data' => $refunds, 'orders' => $orders]);
}

function createAdminRefund(): void
{
    ensureRefundsTable();
    $input = body();
    $orderId = trim((string) ($input['orderId'] ?? ''));
    $amount = round((float) ($input['amount'] ?? 0), 2);
    $reason = trim((string) ($input['reason'] ?? ''));
    if ($orderId === '' || $amount <= 0 || $reason === '') respond(['message' => 'Order, amount and reason are required'], 422);
    $statement = db()->prepare('SELECT p.id, p.amount, p.user_id, p.razorpay_payment_id FROM payments p WHERE p.order_id = ? AND p.status = "SUCCESSFUL"');
    $statement->execute([$orderId]);
    $payment = $statement->fetch();
    if (!$payment) respond(['message' => 'Only successful payments can be refunded'], 422);
    $refundedStatement = db()->prepare('SELECT COALESCE(SUM(amount), 0) FROM refunds WHERE payment_id = ? AND status = "SUCCESSFUL"');
    $refundedStatement->execute([$payment['id']]);
    $remaining = round((float) $payment['amount'] - (float) $refundedStatement->fetchColumn(), 2);
    if ($amount > $remaining) respond(['message' => 'Refund amount exceeds the remaining refundable balance'], 422);
    $razorpayRefund = razorpayRequest('POST', '/payments/' . rawurlencode($payment['razorpay_payment_id']) . '/refund', ['amount' => (int) round($amount * 100), 'notes' => ['reason' => $reason, 'local_order_id' => $orderId]]);
    $refundId = 'refund-' . bin2hex(random_bytes(6));
    $razorpayRefundId = $razorpayRefund['id'] ?? '';
    db()->prepare('INSERT INTO refunds (id, payment_id, order_id, user_id, amount, reason, status, razorpay_refund_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')->execute([$refundId, $payment['id'], $orderId, $payment['user_id'], $amount, $reason, 'SUCCESSFUL', $razorpayRefundId]);
    if ($amount >= $remaining) db()->prepare('UPDATE payments SET status = "REFUNDED" WHERE id = ?')->execute([$payment['id']]);
    createNotification($payment['user_id'], $orderId, 'REFUND_CREATED', 'Your refund has been processed successfully');
    respond(['data' => ['id' => $refundId, 'razorpayRefundId' => $razorpayRefundId], 'message' => 'Refund processed successfully'], 201);
}
