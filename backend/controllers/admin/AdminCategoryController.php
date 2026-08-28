<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';

function categoryImageFromRequest(string $fallback = ''): string
{
    $image = trim((string) ($_POST['image'] ?? '')) ?: $fallback;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        if (!str_starts_with((string) $_FILES['image']['type'], 'image/')) respond(['message' => 'Category image must be an image'], 422);
        $uploadDirectory = __DIR__ . '/../../uploads/products';
        if (!is_dir($uploadDirectory)) mkdir($uploadDirectory, 0775, true);
        $extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $storedName = bin2hex(random_bytes(12)) . '.' . $extension;
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDirectory . '/' . $storedName)) respond(['message' => 'Unable to save category image'], 500);
        $image = '/uploads/products/' . $storedName;
    }
    return $image;
}

function categoryAdminResponse(array $category): array
{
    return [
        'id' => $category['id'],
        'name' => $category['name'],
        'slug' => $category['slug'],
        'description' => $category['description'],
        'image' => $category['image'],
        'products' => (int) $category['products'],
        'status' => $category['status'],
        'created' => $category['created_at'],
    ];
}

function adminCategories(): void
{
    ensureCategoriesTable();
    $statement = db()->query('SELECT c.*, COUNT(p.id) AS products FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.created_at DESC');
    respond(['data' => array_map('categoryAdminResponse', $statement->fetchAll())]);
}

function createAdminCategory(): void
{
    ensureCategoriesTable();
    $input = $_POST ?: body();
    $name = trim((string) ($input['name'] ?? ''));
    $slug = strtolower(trim((string) ($input['slug'] ?? '')));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');
    $description = trim((string) ($input['description'] ?? ''));
    $image = categoryImageFromRequest('https://placehold.co/800x600/e8f5ef/176b4d?text=' . rawurlencode($name));
    if ($name === '' || $slug === '' || $image === '') respond(['message' => 'Category name, slug and image URL are required'], 422);

    $duplicate = db()->prepare('SELECT id FROM categories WHERE name = ? OR slug = ?');
    $duplicate->execute([$name, $slug]);
    if ($duplicate->fetch()) respond(['message' => 'A category with this name or slug already exists'], 409);

    $id = 'category-' . bin2hex(random_bytes(6));
    db()->prepare('INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)')->execute([$id, $name, $slug, $description, $image]);
    respond(['data' => ['id' => $id], 'message' => 'Category created'], 201);
}

function updateAdminCategory(string $categoryId): void
{
    ensureCategoriesTable();
    $input = $_POST ?: body();
    $name = trim((string) ($input['name'] ?? ''));
    $slug = trim((string) ($input['slug'] ?? ''));
    $image = categoryImageFromRequest((string) ($input['image'] ?? '') ?: 'https://placehold.co/800x600/e8f5ef/176b4d?text=' . rawurlencode($name));
    $description = trim((string) ($input['description'] ?? ''));
    if ($name === '' || $slug === '' || $image === '') respond(['message' => 'Category name, slug and image URL are required'], 422);
    $duplicate = db()->prepare('SELECT id FROM categories WHERE (name = ? OR slug = ?) AND id <> ?');
    $duplicate->execute([$name, $slug, $categoryId]);
    if ($duplicate->fetch()) respond(['message' => 'A category with this name or slug already exists'], 409);
    $statement = db()->prepare('UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?');
    $statement->execute([$name, $slug, $description, $image, $categoryId]);
    if ($statement->rowCount() === 0) {
        $exists = db()->prepare('SELECT id FROM categories WHERE id = ?');
        $exists->execute([$categoryId]);
        if (!$exists->fetch()) respond(['message' => 'Category not found'], 404);
    }
    respond(['message' => 'Category updated']);
}

function deleteAdminCategory(string $categoryId): void
{
    ensureCategoriesTable();
    $products = db()->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
    $products->execute([$categoryId]);
    if ((int) $products->fetchColumn() > 0) respond(['message' => 'Remove this category from its products before deleting it'], 409);
    $statement = db()->prepare('DELETE FROM categories WHERE id = ?');
    $statement->execute([$categoryId]);
    if ($statement->rowCount() === 0) respond(['message' => 'Category not found'], 404);
    respond(['message' => 'Category deleted']);
}