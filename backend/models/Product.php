<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function productResponse(array $product): array
{
    $product['id'] = $product['_id'] = $product['id'];
    $imageCover = (string) $product['image_cover'];
    if (str_contains($imageCover, '/uploads/')) $imageCover = 'http://' . ($_SERVER['HTTP_HOST'] ?? 'localhost:8000') . parse_url($imageCover, PHP_URL_PATH);
    $product['imageCover'] = $imageCover;
    $product['ratingsAverage'] = (float) $product['ratings_average'];
    $product['category'] = ['_id' => $product['category_id'], 'name' => $product['category_name']];
    $product['brand'] = ['_id' => $product['brand_id'], 'name' => $product['brand_name']];
    unset($product['image_cover'], $product['ratings_average'], $product['category_id'], $product['category_name'], $product['brand_id'], $product['brand_name'], $product['created_at']);
    return $product;
}

function productById(string $id): ?array
{
    $statement = db()->prepare('SELECT * FROM products WHERE id = ?');
    $statement->execute([$id]);
    $product = $statement->fetch();
    return $product ? productResponse($product) : null;
}
