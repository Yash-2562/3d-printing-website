<?php
declare(strict_types=1);

require_once __DIR__ . '/../support/DatabaseSetup.php';
require_once __DIR__ . '/../services/NotificationService.php';
require_once __DIR__ . '/admin/AdminProductController.php';
require_once __DIR__ . '/admin/AdminCustomerController.php';
require_once __DIR__ . '/admin/AdminNotificationController.php';
require_once __DIR__ . '/admin/AdminDashboardController.php';
require_once __DIR__ . '/admin/AdminPaymentController.php';
require_once __DIR__ . '/admin/AdminSettingsController.php';
require_once __DIR__ . '/admin/AdminOrderController.php';
require_once __DIR__ . '/admin/AdminCustomRequestController.php';
require_once __DIR__ . '/admin/AdminCategoryController.php';

function handleAdminRoutes(string $method, ?string $section, array $segments): void
{
    if ($method === 'GET' && $section === 'summary') adminSummary();
    if ($method === 'POST' && $section === 'products') createAdminProduct();
    if ($method === 'GET' && $section === 'products') adminProducts();
    if ($method === 'GET' && $section === 'categories') adminCategories();
    if ($method === 'POST' && $section === 'categories' && isset($segments[2])) updateAdminCategory($segments[2]);
    if ($method === 'POST' && $section === 'categories') createAdminCategory();
    if ($method === 'PUT' && $section === 'categories' && isset($segments[2])) updateAdminCategory($segments[2]);
    if ($method === 'DELETE' && $section === 'categories' && isset($segments[2])) deleteAdminCategory($segments[2]);
    if ($method === 'PUT' && $section === 'products' && ($segments[3] ?? '') === 'stock' && isset($segments[2])) updateAdminProductStock($segments[2]);
    if ($method === 'PUT' && $section === 'products' && isset($segments[2]) && ($segments[3] ?? '') === 'edit') updateAdminProduct($segments[2]);
    if ($method === 'GET' && $section === 'orders') adminOrders();
    if ($method === 'PUT' && $section === 'orders' && isset($segments[2])) updateAdminOrder($segments[2]);
    if ($method === 'GET' && $section === 'customers') adminCustomers();
    if ($method === 'DELETE' && $section === 'customers' && isset($segments[2])) deleteAdminCustomer($segments[2]);
    if ($method === 'GET' && $section === 'notifications') adminNotifications();
    if ($method === 'DELETE' && $section === 'notifications' && isset($segments[2])) deleteAdminNotification($segments[2]);
    if ($method === 'GET' && $section === 'payments') adminPayments();
    if ($method === 'GET' && $section === 'refunds') adminRefunds();
    if ($method === 'POST' && $section === 'refunds') createAdminRefund();
    if ($method === 'GET' && $section === 'settings') adminSettings();
    if ($method === 'PUT' && $section === 'settings') adminSettings();
    if ($method === 'GET' && $section === 'custom-requests') adminCustomRequests();
    if ($method === 'PUT' && $section === 'custom-requests' && isset($segments[2])) updateCustomRequest($segments[2]);
}
