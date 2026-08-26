<?php
declare(strict_types=1);

require_once __DIR__ . '/../../models/Product.php';

function adminProducts(): void
{
    $statement = db()->query('SELECT * FROM products ORDER BY created_at DESC');
    $products = array_map(static function (array $product): array {
        return [
            'id' => $product['id'],
            'name' => $product['title'],
            'description' => $product['description'],
            'price' => (float) $product['price'],
            'stock' => (int) $product['quantity'],
            'category' => $product['category_name'],
            'material' => $product['material'],
            'sku' => $product['sku'],
            'threshold' => (int) $product['low_stock_threshold'],
            'madeToOrder' => (bool) $product['made_to_order'],
            'status' => $product['status'],
            'featured' => (bool) $product['featured'],
            'imageCover' => $product['image_cover'],
            'createdAt' => $product['created_at'],
        ];
    }, $statement->fetchAll());
    respond(['data' => $products, 'results' => count($products)]);
}

function createAdminProduct(): void
{
    $input = $_POST;
    $name = trim((string) ($input['name'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));
    $price = (float) ($input['price'] ?? 0);
    if ($name === '' || $description === '' || $price < 0) respond(['message' => 'Product name, description and a valid price are required'], 422);

    $imageCover = trim((string) ($input['imageCover'] ?? ''));
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        if (!str_starts_with((string) $_FILES['image']['type'], 'image/')) respond(['message' => 'Main image must be an image'], 422);
        $uploadDirectory = __DIR__ . '/../../uploads/products';
        if (!is_dir($uploadDirectory)) mkdir($uploadDirectory, 0775, true);
        $extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $storedName = bin2hex(random_bytes(12)) . '.' . $extension;
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDirectory . '/' . $storedName)) respond(['message' => 'Unable to save product image'], 500);
        $imageCover = 'http://' . ($_SERVER['HTTP_HOST'] ?? 'localhost:8000') . '/uploads/products/' . $storedName;
    }
    if ($imageCover === '') respond(['message' => 'A main image or image URL is required'], 422);

    $id = 'product-' . bin2hex(random_bytes(6));
    db()->prepare('INSERT INTO products (id, title, description, price, image_cover, ratings_average, category_id, category_name, brand_id, brand_name, quantity, sku, material, low_stock_threshold, made_to_order, status, featured) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
        $id, $name, $description, $price, $imageCover,
        trim((string) ($input['categoryId'] ?? 'category-' . bin2hex(random_bytes(3)))), trim((string) ($input['category'] ?? 'General')),
        trim((string) ($input['brandId'] ?? 'brand-1')), trim((string) ($input['brand'] ?? 'PrintForge')),
        max(0, (int) ($input['stock'] ?? 0)), trim((string) ($input['sku'] ?? '')), trim((string) ($input['material'] ?? 'PLA')),
        max(0, (int) ($input['threshold'] ?? 5)), filter_var($input['madeToOrder'] ?? false, FILTER_VALIDATE_BOOLEAN), strtoupper((string) ($input['status'] ?? 'ACTIVE')) === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE', filter_var($input['featured'] ?? false, FILTER_VALIDATE_BOOLEAN),
    ]);
    respond(['data' => ['id' => $id], 'message' => 'Product created'], 201);
}

function updateAdminProductStock(string $productId): void
{
    $input = body();
    $stock = max(0, (int) ($input['stock'] ?? 0));
    $statement = db()->prepare('UPDATE products SET quantity = ? WHERE id = ?');
    $statement->execute([$stock, $productId]);
    if ($statement->rowCount() === 0) {
        $exists = db()->prepare('SELECT id FROM products WHERE id = ?');
        $exists->execute([$productId]);
        if (!$exists->fetchColumn()) respond(['message' => 'Product not found'], 404);
    }
    respond(['message' => 'Stock updated']);
}

function updateAdminProduct(string $productId): void
{
    $input = body();
    $name = trim((string) ($input['name'] ?? ''));
    $description = trim((string) ($input['description'] ?? ''));
    $price = (float) ($input['price'] ?? 0);
    if ($name === '' || $description === '' || $price < 0) respond(['message' => 'Product name, description and a valid price are required'], 422);
    $status = strtoupper((string) ($input['status'] ?? 'ACTIVE')) === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    $statement = db()->prepare('UPDATE products SET title = ?, description = ?, price = ?, category_name = ?, sku = ?, material = ?, quantity = ?, low_stock_threshold = ?, made_to_order = ?, status = ?, featured = ? WHERE id = ?');
    $statement->execute([$name, $description, $price, trim((string) ($input['category'] ?? 'General')), trim((string) ($input['sku'] ?? '')), trim((string) ($input['material'] ?? 'PLA')), max(0, (int) ($input['stock'] ?? 0)), max(0, (int) ($input['threshold'] ?? 5)), filter_var($input['madeToOrder'] ?? false, FILTER_VALIDATE_BOOLEAN), $status, filter_var($input['featured'] ?? false, FILTER_VALIDATE_BOOLEAN), $productId]);
    $exists = db()->prepare('SELECT id FROM products WHERE id = ?');
    $exists->execute([$productId]);
    if (!$exists->fetchColumn()) respond(['message' => 'Product not found'], 404);
    respond(['message' => 'Product updated']);
}
