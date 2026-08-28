<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

function ensureCategoriesTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS categories (id VARCHAR(40) PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE, slug VARCHAR(140) NOT NULL UNIQUE, description VARCHAR(500) NOT NULL DEFAULT '', image VARCHAR(500) NOT NULL DEFAULT '', status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
    $defaults = [
        ['category-1', 'Nano-Banana Minis', 'nano-banana-minis', 'Tiny viral figures, pocket-size models and cute miniatures.'],
        ['category-2', '3D Printed Gifts', '3d-printed-gifts', 'Personalized gifts, keychains, nameplates and photo lithophanes.'],
        ['category-3', 'Collectibles & Figurines', 'collectibles-figurines', 'Characters, animals, fantasy figures and display pieces.'],
        ['category-4', 'Home & Desk', 'home-desk', 'Organizers, decor, planters, stands and desk accessories.'],
        ['category-5', 'Custom Prints', 'custom-prints', 'Customer-uploaded designs, personalized models and custom orders.'],
    ];
    $statement = db()->prepare('INSERT IGNORE INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)');
    foreach ($defaults as [$id, $name, $slug, $description]) {
        $statement->execute([$id, $name, $slug, $description, 'https://placehold.co/500x300/e8f5ef/176b4d?text=' . rawurlencode($name)]);
    }
}

function ensureOrderStatuses(): void
{
    db()->exec("ALTER TABLE orders MODIFY status ENUM('waiting_confirmation', 'confirmed', 'processing', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation'");
    db()->exec("UPDATE orders SET status = 'printing_started' WHERE status = 'processing'");
    db()->exec("ALTER TABLE orders MODIFY status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation'");
}

function ensureCustomRequestsTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS custom_requests (id VARCHAR(40) PRIMARY KEY, order_id VARCHAR(40) NOT NULL UNIQUE, user_id VARCHAR(40) NOT NULL, file_name VARCHAR(255) NOT NULL DEFAULT '', file_url VARCHAR(500) NOT NULL DEFAULT '', file_type VARCHAR(120) NOT NULL DEFAULT '', print_type VARCHAR(40) NOT NULL, size VARCHAR(40) NOT NULL, material VARCHAR(40) NOT NULL, color VARCHAR(40) NOT NULL, quantity INT NOT NULL, notes TEXT NOT NULL, status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB");
    db()->exec("UPDATE custom_requests SET status = CASE status WHEN 'new' THEN 'waiting_confirmation' WHEN 'under_review' THEN 'waiting_confirmation' WHEN 'quote_sent' THEN 'confirmed' WHEN 'printing' THEN 'printing_started' WHEN 'quality_check' THEN 'printing_started' WHEN 'ready' THEN 'confirmed' WHEN 'rejected' THEN 'cancelled' ELSE status END");
    db()->exec("ALTER TABLE custom_requests MODIFY status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation'");
    db()->exec('UPDATE custom_requests cr JOIN orders o ON o.id = cr.order_id SET cr.status = o.status');
}

function ensureNotificationsTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS notifications (id VARCHAR(40) PRIMARY KEY, user_id VARCHAR(40) NULL, reference_id VARCHAR(40) NOT NULL, type VARCHAR(60) NOT NULL, channel ENUM('EMAIL', 'SMS') NOT NULL DEFAULT 'EMAIL', status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'SENT', message VARCHAR(500) NOT NULL DEFAULT '', error VARCHAR(255) NOT NULL DEFAULT '', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL) ENGINE=InnoDB");
}

function ensureStoreSettingsTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS store_settings (setting_key VARCHAR(80) PRIMARY KEY, setting_value VARCHAR(500) NOT NULL DEFAULT '', updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB");
    $defaults = ['businessName' => 'PrintForge Studio', 'businessEmail' => 'hello@printforge.in', 'businessPhone' => '+91 98765 00000', 'businessAddress' => 'Pune, Maharashtra, India', 'currency' => 'INR', 'shippingCharge' => '100', 'lowStockThreshold' => '5', 'emailNotifications' => '1', 'smsNotifications' => '1', 'paymentGateway' => 'razorpay_dummy', 'razorpayKeyId' => 'rzp_test_printforge', 'razorpayKeySecret' => 'dummy_secret'];
    $statement = db()->prepare('INSERT IGNORE INTO store_settings (setting_key, setting_value) VALUES (?, ?)');
    foreach ($defaults as $key => $value) $statement->execute([$key, $value]);
}

function ensurePaymentsTable(): void
{
    db()->exec("CREATE TABLE IF NOT EXISTS payments (id VARCHAR(40) PRIMARY KEY, order_id VARCHAR(40) NOT NULL UNIQUE, user_id VARCHAR(40) NOT NULL, amount DECIMAL(10,2) NOT NULL, method VARCHAR(40) NOT NULL DEFAULT 'Razorpay', status ENUM('SUCCESSFUL', 'PENDING', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING', razorpay_order_id VARCHAR(80) NOT NULL, razorpay_payment_id VARCHAR(80) NOT NULL DEFAULT '', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB");
}

function ensureRefundsTable(): void
{
    ensurePaymentsTable();
    db()->exec("CREATE TABLE IF NOT EXISTS refunds (id VARCHAR(40) PRIMARY KEY, payment_id VARCHAR(40) NOT NULL, order_id VARCHAR(40) NOT NULL, user_id VARCHAR(40) NOT NULL, amount DECIMAL(10,2) NOT NULL, reason VARCHAR(500) NOT NULL, status ENUM('SUCCESSFUL', 'PENDING', 'FAILED') NOT NULL DEFAULT 'PENDING', razorpay_refund_id VARCHAR(80) NOT NULL DEFAULT '', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB");
}
