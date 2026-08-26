<?php
declare(strict_types=1);

function serveProductUpload(array $segments): void
{
    $file = __DIR__ . '/../uploads/products/' . basename($segments[2]);
    if (!is_file($file)) respond(['message' => 'Image not found'], 404);
    header_remove('Content-Type');
    $mimeTypes = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif'];
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    header('Content-Type: ' . ($mimeTypes[$extension] ?? 'application/octet-stream'));
    header('Content-Length: ' . (string) filesize($file));
    readfile($file);
    exit;
}

function serveCustomerUpload(string $userId, array $segments): void
{
    $fileName = basename($segments[1]);
    $fileStatement = db()->prepare('SELECT file_url FROM custom_requests WHERE user_id = ? AND file_url = ? LIMIT 1');
    $fileStatement->execute([$userId, '/uploads/' . $fileName]);
    if (!$fileStatement->fetchColumn()) respond(['message' => 'File not found'], 404);
    $file = __DIR__ . '/../uploads/' . $fileName;
    if (!is_file($file)) respond(['message' => 'File not found'], 404);
    header_remove('Content-Type');
    $mimeTypes = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'pdf' => 'application/pdf', 'stl' => 'model/stl', 'obj' => 'model/obj', '3mf' => 'model/3mf', 'glb' => 'model/gltf-binary', 'gltf' => 'model/gltf+json'];
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    header('Content-Type: ' . ($mimeTypes[$extension] ?? 'application/octet-stream'));
    header('Content-Disposition: inline; filename="' . $fileName . '"');
    header('Content-Length: ' . (string) filesize($file));
    readfile($file);
    exit;
}
