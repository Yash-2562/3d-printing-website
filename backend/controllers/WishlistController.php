<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';

function handleWishlistRoutes(string $method, ?string $productId, string $userId): void
{
    if ($method === 'GET') {
        $statement = db()->prepare('SELECT p.* FROM wishlist_items wi JOIN products p ON p.id = wi.product_id WHERE wi.user_id = ?');
        $statement->execute([$userId]);
        respond(['data' => array_map('productResponse', $statement->fetchAll())]);
    }

    $pdo = db();
    $input = body();
    if ($method === 'POST') $pdo->prepare('INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)')->execute([$userId, $input['productId'] ?? '']);
    if ($method === 'DELETE' && $productId) $pdo->prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?')->execute([$userId, $productId]);
    $statement = $pdo->prepare('SELECT p.* FROM wishlist_items wi JOIN products p ON p.id = wi.product_id WHERE wi.user_id = ?');
    $statement->execute([$userId]);
    respond(['data' => array_map('productResponse', $statement->fetchAll()), 'message' => 'success']);
}
