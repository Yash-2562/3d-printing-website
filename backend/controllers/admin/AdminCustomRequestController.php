<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';
require_once __DIR__ . '/../../services/NotificationService.php';
require_once __DIR__ . '/../../services/EmailService.php';

function adminCustomRequests(): void
{
    ensureCustomRequestsTable();
    $statement = db()->query('SELECT cr.*, u.name AS customer, u.email, DATE_FORMAT(cr.created_at, "%d %b %Y, %h:%i %p") AS date, o.total AS quote FROM custom_requests cr JOIN users u ON u.id = cr.user_id JOIN orders o ON o.id = cr.order_id ORDER BY cr.created_at DESC');
    respond(['data' => $statement->fetchAll()]);
}

function updateCustomRequest(string $requestId): void
{
    ensureCustomRequestsTable();
    $status = strtolower(trim((string) (body()['status'] ?? '')));
    if (!in_array($status, ['waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled'], true)) respond(['message' => 'Invalid request status'], 422);
    $statement = db()->prepare('SELECT cr.order_id, cr.user_id, o.status AS current_status, o.total, u.name, u.email FROM custom_requests cr JOIN orders o ON o.id = cr.order_id JOIN users u ON u.id = cr.user_id WHERE cr.id = ?');
    $statement->execute([$requestId]);
    $request = $statement->fetch();
    if (!$request) respond(['message' => 'Request not found'], 404);
    db()->beginTransaction();
    db()->prepare('UPDATE custom_requests SET status = ? WHERE id = ?')->execute([$status, $requestId]);
    db()->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $request['order_id']]);
    db()->commit();
    createNotification($request['user_id'], $requestId, 'CUSTOM_REQUEST_STATUS_UPDATED', 'Custom request status updated to ' . $status);
    if ($request['current_status'] !== $status) {
        $emailSent = sendOrderStatusNotification(
            $request['email'],
            $request['name'],
            $request['order_id'],
            $status,
            (float) $request['total']
        );
        error_log($emailSent
            ? "Custom order status email sent for {$request['order_id']} to {$request['email']}"
            : "Failed to send custom order status email for {$request['order_id']} to {$request['email']}");
    }
    respond(['message' => 'Request status updated']);
}
