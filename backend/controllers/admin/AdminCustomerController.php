<?php
declare(strict_types=1);

function adminCustomers(): void
{
    $statement = db()->query('SELECT u.id, u.name, u.email, u.phone, u.created_at AS joined, COUNT(o.id) AS orders, COALESCE(SUM(o.total), 0) AS spent FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id, u.name, u.email, u.phone, u.created_at ORDER BY u.created_at DESC');
    $customers = array_map(static function (array $customer): array {
        return ['id' => $customer['id'], 'name' => $customer['name'], 'email' => $customer['email'], 'phone' => $customer['phone'], 'joined' => $customer['joined'], 'orders' => (int) $customer['orders'], 'spent' => (float) $customer['spent'], 'status' => 'ACTIVE'];
    }, $statement->fetchAll());
    respond(['data' => $customers]);
}

function deleteAdminCustomer(string $customerId): void
{
    $statement = db()->prepare('DELETE FROM users WHERE id = ?');
    $statement->execute([$customerId]);
    if ($statement->rowCount() === 0) respond(['message' => 'Customer not found'], 404);
    respond(['message' => 'Customer deleted']);
}
