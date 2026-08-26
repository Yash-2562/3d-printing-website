<?php
declare(strict_types=1);

require_once __DIR__ . '/Product.php';

function cartFor(string $userId): array
{
    $pdo = db();
    $statement = $pdo->prepare('SELECT id FROM carts WHERE user_id = ?');
    $statement->execute([$userId]);
    $cartId = $statement->fetchColumn();
    if (!$cartId) {
        $cartId = 'cart-' . bin2hex(random_bytes(6));
        $pdo->prepare('INSERT INTO carts (id, user_id) VALUES (?, ?)')->execute([$cartId, $userId]);
    }
    $statement = $pdo->prepare('SELECT ci.quantity AS cart_quantity, p.* FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = ?');
    $statement->execute([$cartId]);
    $items = [];
    $total = 0;
    foreach ($statement->fetchAll() as $row) {
        $product = productResponse($row);
        $price = (float) $row['price'];
        $maxQuantity = max(0, (int) ($row['quantity'] ?? 0));
        $quantity = min((int) $row['cart_quantity'], $maxQuantity);
        if ($quantity < 1) {
            $pdo->prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?')->execute([$cartId, $row['id']]);
            continue;
        }
        if ($quantity !== (int) $row['cart_quantity']) $pdo->prepare('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?')->execute([$quantity, $cartId, $row['id']]);
        $items[] = ['product' => $product, 'count' => $quantity, 'price' => $price];
        $total += $price * $quantity;
    }
    return ['_id' => $cartId, 'products' => $items, 'totalCartPrice' => $total];
}
