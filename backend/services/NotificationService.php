<?php
declare(strict_types=1);

require_once __DIR__ . '/../support/DatabaseSetup.php';

function createNotification(?string $userId, string $referenceId, string $type, string $message): void
{
    ensureNotificationsTable();
    db()->prepare('INSERT INTO notifications (id, user_id, reference_id, type, channel, status, message) VALUES (?, ?, ?, ?, ?, ?, ?)')->execute(['notification-' . bin2hex(random_bytes(6)), $userId, $referenceId, $type, 'EMAIL', 'SENT', $message]);
}
