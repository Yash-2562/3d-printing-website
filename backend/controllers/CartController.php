<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Cart.php';
require_once __DIR__ . '/../models/Product.php';

function handleCartRoutes(string $method, ?string $productId, string $userId): void
{
    if ($method === 'GET') respond(['data' => cartFor($userId)]);

    $cart = cartFor($userId);
    $pdo = db();
    $input = body();

    if ($method === 'POST') {
        $product = productById((string) ($input['productId'] ?? ''));
        if (!$product) respond(['message' => 'Product not found'], 404);
        $existing = $pdo->prepare('SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?');
        $existing->execute([$cart['_id'], $product['_id']]);
        $currentQuantity = (int) ($existing->fetchColumn() ?: 0);
        $maxQuantity = (int) ($product['quantity'] ?? 0);
        if ($maxQuantity < 1 || $currentQuantity >= $maxQuantity) respond(['message' => 'You cannot add more than the available stock'], 422);
        $pdo->prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1')->execute([$cart['_id'], $product['_id']]);
    } elseif ($method === 'PUT' && $productId) {
        $product = productById($productId);
        if (!$product) respond(['message' => 'Product not found'], 404);
        $requestedQuantity = max(1, (int) ($input['count'] ?? 1));
        $maxQuantity = (int) ($product['quantity'] ?? 0);
        if ($requestedQuantity > $maxQuantity) respond(['message' => 'You cannot add more than the available stock'], 422);
        $pdo->prepare('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?')->execute([$requestedQuantity, $cart['_id'], $productId]);
    } elseif ($method === 'DELETE') {
        $query = $productId ? 'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?' : 'DELETE FROM cart_items WHERE cart_id = ?';
        $pdo->prepare($query)->execute($productId ? [$cart['_id'], $productId] : [$cart['_id']]);
    }

    respond(['data' => cartFor($userId), 'message' => 'success']);
}
