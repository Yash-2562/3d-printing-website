<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../support/DatabaseSetup.php';

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
    if ($resource === 'categories') {
        ensureCategoriesTable();
        $values = array_map(static function (array $category): array {
            $category['_id'] = $category['id'];
            return $category;
        }, db()->query("SELECT id, name, slug, description, image, status, created_at FROM categories WHERE status = 'ACTIVE' ORDER BY name")->fetchAll());

        respond(['data' => $values]);
    }

    $column = 'brand';
    $statement = db()->query("SELECT DISTINCT {$column}_id AS id, {$column}_name AS name FROM products ORDER BY name");
    $values = array_map(static function (array $value): array {
        $value['_id'] = $value['id'];
        $value['image'] = 'https://placehold.co/500x300/e8f5ef/176b4d?text=' . rawurlencode($value['name']);
        return $value;
    }, $statement->fetchAll());
    respond(['data' => $values]);
}

function showCategory(string $categoryId): void
{
    ensureCategoriesTable();
    $categoryStatement = db()->prepare("SELECT id, name, slug, description, image, status FROM categories WHERE id = ? AND status = 'ACTIVE'");
    $categoryStatement->execute([$categoryId]);
    $category = $categoryStatement->fetch();
    if (!$category) respond(['message' => 'Category not found'], 404);

    $productsStatement = db()->prepare('SELECT * FROM products WHERE category_id = ? AND status = \'ACTIVE\' ORDER BY created_at DESC');
    $productsStatement->execute([$categoryId]);
    $category['_id'] = $category['id'];
    $category['products'] = array_map('productResponse', $productsStatement->fetchAll());
    respond(['data' => $category]);
}
