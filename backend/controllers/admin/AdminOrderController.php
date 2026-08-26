<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';
require_once __DIR__ . '/../../services/NotificationService.php';
require_once __DIR__ . '/../../services/EmailService.php';

function adminOrders(): void
{
    ensureOrderStatuses();
    ensureCustomRequestsTable();
    ensurePaymentsTable();
    $statement = db()->query('SELECT o.id, u.name AS customer, u.email, o.total, o.status, DATE_FORMAT(o.created_at, "%d %b %Y, %h:%i %p") AS date, COALESCE(SUM(oi.quantity), MAX(cr.quantity), 0) AS items, GROUP_CONCAT(CONCAT(oi.product_title, " x", oi.quantity) SEPARATOR ", ") AS orderItems, o.shipping_address AS shippingAddress, MAX(cr.id) AS customRequestId, MAX(cr.print_type) AS customPrintType, MAX(cr.size) AS customSize, MAX(cr.material) AS customMaterial, MAX(cr.color) AS customColor, MAX(cr.quantity) AS customQuantity, MAX(cr.notes) AS customNotes, MAX(p.status) AS paymentStatus, MAX(p.razorpay_payment_id) AS razorpayPayment FROM orders o JOIN users u ON u.id = o.user_id LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN custom_requests cr ON cr.order_id = o.id LEFT JOIN payments p ON p.order_id = o.id GROUP BY o.id, u.name, u.email, o.total, o.status, o.created_at, o.shipping_address ORDER BY o.created_at DESC');
    respond(['data' => $statement->fetchAll()]);
}

function updateAdminOrder(string $orderId): void
{
    ensureOrderStatuses();
    ensureCustomRequestsTable();
    $status = strtolower(trim((string) (body()['status'] ?? '')));
    if (!in_array($status, ['waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled'], true)) respond(['message' => 'Invalid order status'], 422);
    
    // Check if order exists and get user details
    $orderStatement = db()->prepare('SELECT o.id, o.user_id, o.total, u.name, u.email FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?');
    $orderStatement->execute([$orderId]);
    $orderData = $orderStatement->fetch();
    
    if (!$orderData) respond(['message' => 'Order not found'], 404);
    
    // Update order status
    $statement = db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $statement->execute([$status, $orderId]);
    db()->prepare('UPDATE custom_requests SET status = ? WHERE order_id = ?')->execute([$status, $orderId]);
    
    // Create in-app notification
    createNotification($orderData['user_id'], $orderId, 'ORDER_STATUS_UPDATED', 'Order status updated to ' . $status);
    
    // Send email notification (except for waiting_confirmation status)
    if ($status !== 'waiting_confirmation') {
        $emailSent = sendOrderStatusNotification(
            $orderData['email'],
            $orderData['name'],
            $orderId,
            $status,
            (float) $orderData['total']
        );
        
        if ($emailSent) {
            error_log("Order status email sent for order {$orderId} to {$orderData['email']}");
        } else {
            error_log("Failed to send order status email for order {$orderId} to {$orderData['email']}");
        }
    }
    
    respond(['message' => 'Order status updated']);
}
