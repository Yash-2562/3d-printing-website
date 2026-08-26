<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';

function listProducts(?string $productId): void
{
    $statement = $productId ? db()->prepare('SELECT * FROM products WHERE id = ?') : db()->query('SELECT * FROM products ORDER BY created_at DESC');
    if ($productId) $statement->execute([$productId]);
    $rows = $statement->fetchAll();
    if ($productId && !$rows) respond(['message' => 'Product not found'], 404);
    $data = array_map('productResponse', $rows);
    respond($productId ? ['data' => $data[0]] : ['data' => $data, 'results' => count($data)]);
}

function listCatalogTaxonomy(string $resource): void
{
    $column = $resource === 'categories' ? 'category' : 'brand';
    $statement = db()->query("SELECT DISTINCT {$column}_id AS id, {$column}_name AS name FROM products ORDER BY name");
    $values = array_map(static function (array $value): array {
        $value['_id'] = $value['id'];
        $value['image'] = 'https://placehold.co/500x300/e8f5ef/176b4d?text=' . rawurlencode($value['name']);
        return $value;
    }, $statement->fetchAll());
    respond(['data' => $values]);
}
