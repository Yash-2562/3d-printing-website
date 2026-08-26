<?php
declare(strict_types=1);

function requestRoute(): array
{
    $path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '', '/');
    $path = preg_replace('#^api/v1/?#', '', $path);
    $segments = $path === '' ? [] : array_map('urldecode', explode('/', $path));
    return [$segments, $_SERVER['REQUEST_METHOD'], $segments[0] ?? '', $segments[1] ?? null];
}
