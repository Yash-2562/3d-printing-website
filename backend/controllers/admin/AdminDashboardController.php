<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';

function adminSummary(): void
{
    ensureOrderStatuses();
    ensureCustomRequestsTable();
    $products = (int) db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $customers = (int) db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $orders = (int) db()->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    $revenue = (float) db()->query('SELECT COALESCE(SUM(total), 0) FROM orders')->fetchColumn();
    $todayOrders = (int) db()->query('SELECT COUNT(*) FROM orders WHERE created_at >= CURDATE()')->fetchColumn();
    $monthRevenue = (float) db()->query('SELECT COALESCE(SUM(total), 0) FROM orders WHERE created_at >= DATE_FORMAT(CURDATE(), "%Y-%m-01")')->fetchColumn();
    $printing = (int) db()->query("SELECT COUNT(*) FROM orders WHERE status = 'printing_started'")->fetchColumn();
    $delivered = (int) db()->query("SELECT COUNT(*) FROM orders WHERE status = 'delivered'")->fetchColumn();
    $customRequests = (int) db()->query('SELECT COUNT(*) FROM custom_requests')->fetchColumn();
    $requestsForReview = (int) db()->query("SELECT COUNT(*) FROM custom_requests WHERE status IN ('new', 'under_review')")->fetchColumn();

    $revenueStatement = db()->query("SELECT DATE_FORMAT(month_start, '%b') AS label, COALESCE(SUM(o.total), 0) AS value FROM (SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL month_offset MONTH), '%Y-%m-01') AS month_start FROM (SELECT 0 AS month_offset UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) months) calendar LEFT JOIN orders o ON DATE_FORMAT(o.created_at, '%Y-%m-01') = calendar.month_start GROUP BY month_start ORDER BY month_start");
    $revenueByMonth = array_map(static fn (array $row): array => ['label' => $row['label'], 'value' => (float) $row['value']], $revenueStatement->fetchAll());

    $requestStatement = db()->query("SELECT id, file_name AS name, status, DATE_FORMAT(created_at, '%d %b %Y, %h:%i %p') AS date FROM custom_requests WHERE status IN ('new', 'under_review') ORDER BY created_at DESC LIMIT 3");
    $customQueue = $requestStatement->fetchAll();
    $orderStatement = db()->query('SELECT o.id, u.name AS customer, COALESCE(MAX(oi.product_title), "Custom print request") AS product, o.total, o.status, DATE_FORMAT(o.created_at, "%d %b %Y, %h:%i %p") AS date FROM orders o JOIN users u ON u.id = o.user_id LEFT JOIN order_items oi ON oi.order_id = o.id GROUP BY o.id, u.name, o.total, o.status, o.created_at ORDER BY o.created_at DESC LIMIT 4');
    $recentOrders = array_map(static function (array $row): array {
        $row['total'] = (float) $row['total'];
        return $row;
    }, $orderStatement->fetchAll());
    $printingOrders = db()->query("SELECT o.id, u.name AS customer, o.total, o.status, DATE_FORMAT(o.created_at, '%d %b %Y, %h:%i %p') AS date FROM orders o JOIN users u ON u.id = o.user_id WHERE o.status = 'printing_started' ORDER BY o.created_at DESC")->fetchAll();
    $deliveredOrders = db()->query("SELECT o.id, u.name AS customer, o.total, o.status, DATE_FORMAT(o.created_at, '%d %b %Y, %h:%i %p') AS date FROM orders o JOIN users u ON u.id = o.user_id WHERE o.status = 'delivered' ORDER BY o.created_at DESC")->fetchAll();

    respond(['data' => compact('products', 'customers', 'orders', 'revenue', 'todayOrders', 'monthRevenue', 'printing', 'delivered', 'customRequests', 'requestsForReview', 'revenueByMonth', 'customQueue', 'recentOrders', 'printingOrders', 'deliveredOrders')]);
}
