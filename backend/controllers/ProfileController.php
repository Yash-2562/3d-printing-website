<?php
declare(strict_types=1);

require_once __DIR__ . '/../middlewares/AuthMiddleware.php';

function showProfile(array $user): void
{
    respond(['data' => publicUser($user)]);
}

function updateProfile(array $user, string $userId): void
{
    $input = body();
    $phone = preg_replace('/\D/', '', (string) ($input['phone'] ?? $user['phone']));
    if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) respond(['message' => 'Enter a valid 10-digit Indian mobile number'], 422);
    db()->prepare('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?')->execute([trim($input['name'] ?? $user['name']), $phone, trim($input['address'] ?? $user['address']), $userId]);
    $statement = db()->prepare('SELECT * FROM users WHERE id = ?');
    $statement->execute([$userId]);
    respond(['data' => publicUser($statement->fetch()), 'message' => 'Profile updated successfully']);
}
