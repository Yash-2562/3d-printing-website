<?php
declare(strict_types=1);

function loadEnvironment(string $file): void
{
    if (!is_readable($file)) return;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        if (getenv($key) === false) putenv($key . '=' . trim($value, " \t\"'"));
    }
}

loadEnvironment(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env');

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: '3d-prints');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
define('APP_KEY', getenv('APP_KEY') ?: 'local-development-key');
define('PUBLIC_BACKEND_URL', rtrim(getenv('PUBLIC_BACKEND_URL') ?: '', '/'));
define('RAZORPAY_KEY_ID', getenv('RAZORPAY_KEY_ID') ?: '');
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: '');
define('FRONTEND_URL', rtrim(getenv('FRONTEND_URL') ?: 'http://localhost:5173', '/'));
define('FRONTEND_URLS', array_values(array_filter(array_map(
    static fn(string $origin): string => rtrim(trim($origin), '/'),
    explode(',', getenv('FRONTEND_URLS') ?: FRONTEND_URL)
))));
define('MAIL_HOST', getenv('MAIL_HOST') ?: 'smtp.gmail.com');
define('MAIL_PORT', getenv('MAIL_PORT') ?: '587');
define('MAIL_USERNAME', getenv('MAIL_USERNAME') ?: '');
define('MAIL_PASSWORD', getenv('MAIL_PASSWORD') ?: '');
define('MAIL_FROM_NAME', getenv('MAIL_FROM_NAME') ?: 'Admin');

function razorpayRequest(string $method, string $path, ?array $payload = null): array
{
    if (RAZORPAY_KEY_ID === '' || RAZORPAY_KEY_SECRET === '') respond(['message' => 'Razorpay test keys are not configured. Add them to backend/.env'], 503);
    $url = 'https://api.razorpay.com/v1' . $path;
    $encodedPayload = $payload === null ? null : json_encode($payload);
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_USERPWD => RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET, CURLOPT_HTTPAUTH => CURLAUTH_BASIC, CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_TIMEOUT => 20]);
        if ($encodedPayload !== null) curl_setopt($curl, CURLOPT_POSTFIELDS, $encodedPayload);
        $response = curl_exec($curl); $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE); $error = curl_error($curl);
    } else {
        $headers = 'Authorization: Basic ' . base64_encode(RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET) . "\r\nContent-Type: application/json\r\n";
        $context = stream_context_create(['http' => ['method' => $method, 'header' => $headers, 'content' => $encodedPayload ?? '', 'timeout' => 20, 'ignore_errors' => true]]);
        $response = @file_get_contents($url, false, $context); $status = 0; $error = $response === false ? 'PHP could not connect to Razorpay' : '';
        foreach ($http_response_header ?? [] as $header) if (preg_match('#^HTTP/\S+\s+(\d+)#', $header, $matches)) { $status = (int) $matches[1]; break; }
    }
    if ($response === false || $error !== '') respond(['message' => 'Unable to reach Razorpay: ' . $error], 502);
    $data = json_decode($response, true);
    if (!is_array($data)) respond(['message' => 'Razorpay returned an invalid response'], 502);
    if ($status < 200 || $status >= 300) respond(['message' => $data['error']['description'] ?? 'Razorpay request failed'], 502);
    return $data;
}
