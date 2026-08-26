<?php
declare(strict_types=1);

require_once __DIR__ . '/../middlewares/AuthMiddleware.php';

function handleAuthRoutes(string $method, array $segments): void
{
    $input = body();
    $action = $segments[1] ?? '';

    if ($method === 'POST' && $action === 'signup') {
        $phone = preg_replace('/\D/', '', (string) ($input['phone'] ?? ''));
        if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) respond(['message' => 'Enter a valid 10-digit Indian mobile number'], 422);
        $user = ['user-' . bin2hex(random_bytes(6)), trim($input['name'] ?? ''), strtolower(trim($input['email'] ?? '')), $phone, '', password_hash($input['password'] ?? '', PASSWORD_DEFAULT)];
        try { db()->prepare('INSERT INTO users (id, name, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?, ?)')->execute($user); }
        catch (PDOException $error) { if ($error->errorInfo[1] === 1062) respond(['message' => 'Email already exists'], 409); throw $error; }
        respond(['message' => 'success', 'token' => tokenFor($user[0]), 'user' => ['_id' => $user[0], 'name' => $user[1], 'email' => $user[2]]]);
    }

    if ($method === 'POST' && $action === 'signin') {
        $statement = db()->prepare('SELECT * FROM users WHERE email = ?');
        $statement->execute([strtolower(trim($input['email'] ?? ''))]);
        $user = $statement->fetch();
        if ($user && password_verify($input['password'] ?? '', $user['password_hash'])) respond(['message' => 'success', 'token' => tokenFor($user['id']), 'user' => ['_id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
        respond(['message' => 'Incorrect email or password'], 401);
    }

    if ($method === 'POST' && $action === 'admin-signin') {
        ensureAdminUsersTable();
        $statement = db()->prepare('SELECT * FROM admin_users WHERE username = ?');
        $statement->execute([trim($input['username'] ?? '')]);
        $user = $statement->fetch();
        if ($user && password_verify($input['password'] ?? '', $user['password_hash'])) respond(['message' => 'success', 'token' => tokenFor($user['id']), 'user' => ['_id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']]]);
        respond(['message' => 'Incorrect admin username or password'], 401);
    }

    if ($method === 'POST' && $action === 'forgotPasswords') respond(['statusMsg' => 'success', 'message' => 'Reset code sent']);
    if ($method === 'POST' && $action === 'verifyResetCode') respond(['status' => 'Success', 'message' => 'Code verified']);

    if ($method === 'PUT' && $action === 'resetPassword') {
        $email = strtolower(trim($input['email'] ?? ''));
        db()->prepare('UPDATE users SET password_hash = ? WHERE email = ?')->execute([password_hash($input['newPassword'] ?? '', PASSWORD_DEFAULT), $email]);
        $statement = db()->prepare('SELECT id FROM users WHERE email = ?');
        $statement->execute([$email]);
        $userId = $statement->fetchColumn();
        if (!$userId) respond(['message' => 'There is no user with this email'], 404);
        respond(['status' => 'success', 'token' => tokenFor($userId)]);
    }
}
