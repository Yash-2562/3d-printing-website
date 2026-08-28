<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function configureHttp(): void
{
    header('Content-Type: application/json; charset=utf-8');
    $origin = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');
    if ($origin !== '' && in_array($origin, FRONTEND_URLS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Headers: Content-Type, token, Authorization, ngrok-skip-browser-warning');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 86400');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function body(): array
{
    $value = json_decode(file_get_contents('php://input'), true);
    return is_array($value) ? $value : [];
}
