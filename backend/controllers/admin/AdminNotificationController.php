<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';

function deleteAdminNotification(string $notificationId): void
{
    ensureNotificationsTable();
    $statement = db()->prepare('DELETE FROM notifications WHERE id = ?');
    $statement->execute([$notificationId]);
    if ($statement->rowCount() === 0) respond(['message' => 'Notification not found'], 404);
    respond(['message' => 'Notification deleted']);
}

function adminNotifications(): void
{
    ensureNotificationsTable();
    $statement = db()->query('SELECT n.id, COALESCE(u.name, "Unknown customer") AS customer, n.reference_id AS reference, n.type, n.channel, n.status, DATE_FORMAT(n.created_at, "%d %b %Y, %h:%i %p") AS date, COALESCE(NULLIF(n.error, ""), "-") AS error FROM notifications n LEFT JOIN users u ON u.id = n.user_id ORDER BY n.created_at DESC');
    respond(['data' => $statement->fetchAll()]);
}
