<?php
declare(strict_types=1);

require_once __DIR__ . '/../support/DatabaseSetup.php';
require_once __DIR__ . '/../services/NotificationService.php';

function createCustomerCustomRequest(array $user, string $userId): void
{
    ensureCustomRequestsTable();
    $input = $_POST;
    $printType = trim((string) ($input['printType'] ?? 'mini'));
    $size = trim((string) ($input['size'] ?? 'small'));
    $material = trim((string) ($input['material'] ?? 'PLA'));
    $color = trim((string) ($input['color'] ?? 'White'));
    $quantity = max(1, (int) ($input['quantity'] ?? 1));
    $notes = trim((string) ($input['notes'] ?? ''));
    $prices = ['small' => 499, 'medium' => 799, 'large' => 1299];
    $total = ($prices[$size] ?? 499) * $quantity;
    $fileName = '';
    $fileUrl = '';
    $fileType = '';

    if (isset($_FILES['file'])) {
        if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) respond(['message' => 'The file upload failed. Please choose the file again.'], 422);
        $extension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'stl', 'obj', '3mf', 'glb', 'gltf'], true)) respond(['message' => 'Unsupported file type'], 422);
        $uploadDirectory = __DIR__ . '/../uploads';
        if (!is_dir($uploadDirectory)) mkdir($uploadDirectory, 0775, true);
        $storedName = bin2hex(random_bytes(12)) . '.' . $extension;
        if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadDirectory . '/' . $storedName)) respond(['message' => 'Unable to save uploaded file'], 500);
        $fileName = basename($_FILES['file']['name']);
        $fileUrl = '/uploads/' . $storedName;
        $fileType = (string) $_FILES['file']['type'];
    }

    $pdo = db();
    $pdo->beginTransaction();
    do { $orderId = '#PF-' . random_int(1000, 9999); $exists = $pdo->prepare('SELECT COUNT(*) FROM orders WHERE id = ?'); $exists->execute([$orderId]); } while ((int) $exists->fetchColumn() > 0);
    $requestId = '#CP-' . random_int(1000, 9999);
    $pdo->prepare('INSERT INTO orders (id, user_id, total, status, shipping_address) VALUES (?, ?, ?, ?, ?)')->execute([$orderId, $userId, $total, 'waiting_confirmation', $user['address']]);
    $pdo->prepare('INSERT INTO custom_requests (id, order_id, user_id, file_name, file_url, file_type, print_type, size, material, color, quantity, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([$requestId, $orderId, $userId, $fileName, $fileUrl, $fileType, $printType, $size, $material, $color, $quantity, $notes]);
    $pdo->commit();
    createNotification($userId, $requestId, 'CUSTOM_REQUEST_RECEIVED', 'Custom print request received');
    respond(['status' => 'success', 'requestId' => $requestId, 'orderId' => $orderId, 'message' => 'Custom order created']);
}
