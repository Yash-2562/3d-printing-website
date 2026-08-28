<?php
declare(strict_types=1);

require_once __DIR__ . '/config/http.php';

configureHttp();

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/middlewares/AuthMiddleware.php';
require_once __DIR__ . '/controllers/AdminController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/CatalogController.php';
require_once __DIR__ . '/controllers/CartController.php';
require_once __DIR__ . '/controllers/CustomRequestController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/ProfileController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/controllers/WishlistController.php';
require_once __DIR__ . '/routes/routes.php';

[$segments, $method, $resource, $id] = requestRoute();

if ($resource === 'health') respond(['status' => 'ok', 'service' => 'PrintForge MySQL API']);

if ($resource === 'uploads' && $id === 'products' && $method === 'GET' && isset($segments[2])) {
    serveProductUpload($segments);
}

if ($resource === 'auth') {
    handleAuthRoutes($method, $segments);
    respond(['message' => 'Endpoint not found'], 404);
}

if ($resource === 'products' && $method === 'GET') listProducts($id);

if ($resource === 'categories' && $method === 'GET' && $id) showCategory($id);

if (($resource === 'categories' || $resource === 'brands') && $method === 'GET') {
    listCatalogTaxonomy($resource);
}

$user = currentUser();
$userId = $user['id'];

if ($resource === 'uploads' && $method === 'GET' && isset($segments[1])) {
    serveCustomerUpload($userId, $segments);
}

if ($resource === 'admin') {
    handleAdminRoutes($method, $id, $segments);
    respond(['message' => 'Endpoint not found'], 404);
}

if ($resource === 'profile') {
    if ($method === 'GET') showProfile($user);
    if ($method === 'PUT') updateProfile($user, $userId);
}

if ($resource === 'cart') handleCartRoutes($method, $id, $userId);

if ($resource === 'wishlist') handleWishlistRoutes($method, $id, $userId);

if ($resource === 'orders') {
    if ($method === 'GET') listCustomerOrders($userId);
    if ($method === 'POST' && ($segments[1] ?? '') === 'checkout-session') createCheckoutSession($userId);
    if ($method === 'POST' && ($segments[1] ?? '') === 'payment-verify') verifyCustomerPayment($userId);
}

if ($resource === 'custom-requests' && $method === 'POST') {
    createCustomerCustomRequest($user, $userId);
}

respond(['message' => 'Endpoint not found'], 404);
