<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

function ensureAdminUsersTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS admin_users (id VARCHAR(40) PRIMARY KEY, username VARCHAR(80) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
    $statement = db()->prepare('SELECT id FROM admin_users WHERE username = ?');
    $statement->execute(['3D-admin']);
    if (!$statement->fetchColumn()) {
        db()->prepare('INSERT INTO admin_users (id, username, name, email, password_hash) VALUES (?, ?, ?, ?, ?)')->execute(['admin-3d', '3D-admin', '3D Admin', '3d-admin@printforge.in', '$2y$12$DuXWnFuca7V7h9TVguv65ePUkMAceqGX9JyTc0hpvRVxCcxcoWz9a']);
    }
}

function tokenFor(string $userId): string
{
    $payload = base64_encode(json_encode(['id' => $userId, 'exp' => time() + 86400]));
    $signature = hash_hmac('sha256', $payload, APP_KEY);
    return $payload . '.' . $signature;
}

function currentUser(): array
{
    $parts = explode('.', $_SERVER['HTTP_TOKEN'] ?? '');
    if (count($parts) !== 2) respond(['message' => 'You are not logged in'], 401);
    $payload = json_decode(base64_decode($parts[0]), true);
    $signature = hash_hmac('sha256', $parts[0], APP_KEY);
    if (!is_array($payload) || !hash_equals($signature, $parts[1]) || ($payload['exp'] ?? 0) < time()) respond(['message' => 'Invalid or expired token'], 401);
    $statement = db()->prepare('SELECT * FROM users WHERE id = ?');
    $statement->execute([$payload['id'] ?? '']);
    $user = $statement->fetch();
    if (!$user) {
        $statement = db()->prepare('SELECT id, username, name, email, "" AS phone, "" AS address, password_hash, created_at FROM admin_users WHERE id = ?');
        $statement->execute([$payload['id'] ?? '']);
        $user = $statement->fetch();
    }
    if (!$user) respond(['message' => 'User not found'], 401);
    return $user;
}

function publicUser(array $user): array
{
    unset($user['password_hash']);
    return $user;
}
