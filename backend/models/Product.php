<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function productImageUrl(string $imageCover): string
{
    if (!str_contains($imageCover, '/uploads/')) return $imageCover;

    $path = parse_url($imageCover, PHP_URL_PATH) ?: $imageCover;
    if (PUBLIC_BACKEND_URL !== '') return PUBLIC_BACKEND_URL . $path;

    $forwardedProtocol = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0]);
    $forwardedHost = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_HOST'] ?? ''))[0]);
    $scheme = $forwardedProtocol ?: ((($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
    $host = $forwardedHost ?: ($_SERVER['HTTP_HOST'] ?? 'localhost:8000');
    return $scheme . '://' . $host . $path;
}

function productResponse(array $product): array
{
    $product['id'] = $product['_id'] = $product['id'];
    $product['imageCover'] = productImageUrl((string) $product['image_cover']);
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
