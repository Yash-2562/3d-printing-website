CREATE DATABASE IF NOT EXISTS `3d-prints`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `3d-prints`;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone CHAR(10) NOT NULL,
  address VARCHAR(500) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(40) PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL DEFAULT '',
  image VARCHAR(500) NOT NULL DEFAULT '',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO admin_users (id, username, name, email, password_hash)
VALUES ('admin-3d', '3D-admin', '3D Admin', '3d-admin@printforge.in', '$2y$12$DuXWnFuca7V7h9TVguv65ePUkMAceqGX9JyTc0hpvRVxCcxcoWz9a')
ON DUPLICATE KEY UPDATE username = VALUES(username), name = VALUES(name), password_hash = VALUES(password_hash);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(40) PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_cover VARCHAR(500) NOT NULL,
  ratings_average DECIMAL(3,2) NOT NULL DEFAULT 0,
  category_id VARCHAR(40) NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  brand_id VARCHAR(40) NOT NULL,
  brand_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  sku VARCHAR(80) NOT NULL DEFAULT '',
  material VARCHAR(80) NOT NULL DEFAULT 'PLA',
  low_stock_threshold INT NOT NULL DEFAULT 5,
  made_to_order BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sku VARCHAR(80) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS material VARCHAR(80) NOT NULL DEFAULT 'PLA',
  ADD COLUMN IF NOT EXISTS low_stock_threshold INT NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS made_to_order BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS carts (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (cart_id, product_id),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wishlist_items (
  user_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  PRIMARY KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation',
  shipping_address VARCHAR(500) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE orders
  MODIFY status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation';

CREATE TABLE IF NOT EXISTS order_items (
  order_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  product_title VARCHAR(180) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS custom_requests (
  id VARCHAR(40) PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL UNIQUE,
  user_id VARCHAR(40) NOT NULL,
  file_name VARCHAR(255) NOT NULL DEFAULT '',
  file_url VARCHAR(500) NOT NULL DEFAULT '',
  file_type VARCHAR(120) NOT NULL DEFAULT '',
  print_type VARCHAR(40) NOT NULL,
  size VARCHAR(40) NOT NULL,
  material VARCHAR(40) NOT NULL,
  color VARCHAR(40) NOT NULL,
  quantity INT NOT NULL,
  notes TEXT NOT NULL,
  status ENUM('waiting_confirmation', 'confirmed', 'printing_started', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'waiting_confirmation',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NULL,
  reference_id VARCHAR(40) NOT NULL,
  type VARCHAR(60) NOT NULL,
  channel ENUM('EMAIL', 'SMS') NOT NULL DEFAULT 'EMAIL',
  status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'SENT',
  message VARCHAR(500) NOT NULL DEFAULT '',
  error VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS store_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value VARCHAR(500) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO store_settings (setting_key, setting_value) VALUES
('businessName', 'PrintForge Studio'), ('businessEmail', 'hello@printforge.in'), ('businessPhone', '+91 98765 00000'),
('businessAddress', 'Pune, Maharashtra, India'), ('currency', 'INR'), ('shippingCharge', '100'),
('lowStockThreshold', '5'), ('emailNotifications', '1'), ('smsNotifications', '1'),
('paymentGateway', 'razorpay_dummy'), ('razorpayKeyId', 'rzp_test_printforge'), ('razorpayKeySecret', 'dummy_secret')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(40) PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL UNIQUE,
  user_id VARCHAR(40) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(40) NOT NULL DEFAULT 'Razorpay',
  status ENUM('SUCCESSFUL', 'PENDING', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  razorpay_order_id VARCHAR(80) NOT NULL,
  razorpay_payment_id VARCHAR(80) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refunds (
  id VARCHAR(40) PRIMARY KEY,
  payment_id VARCHAR(40) NOT NULL,
  order_id VARCHAR(40) NOT NULL,
  user_id VARCHAR(40) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(500) NOT NULL,
  status ENUM('SUCCESSFUL', 'PENDING', 'FAILED') NOT NULL DEFAULT 'PENDING',
  razorpay_refund_id VARCHAR(80) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO products (id, title, description, price, image_cover, ratings_average, category_id, category_name, brand_id, brand_name, quantity)
VALUES
('product-1', 'Custom Desk Planter', 'A practical 3D printed planter.', 450, 'https://placehold.co/600x600/e8f5ef/176b4d?text=Desk+Planter', 4.50, 'category-1', 'Home', 'brand-1', 'PrintForge', 25),
('product-2', 'Articulated Dragon', 'Flexible collectible printed to order.', 700, 'https://placehold.co/600x600/f5eee8/8a4b27?text=Articulated+Dragon', 4.80, 'category-2', 'Collectibles', 'brand-1', 'PrintForge', 12)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO users (id, name, email, phone, address, password_hash)
VALUES ('demo-customer', 'Demo Customer', 'demo@printforge.in', '9876543210', '12 Demo Street, Bengaluru', '$2y$12$ahRLiAJBOP0QJMXT7Q.B1uRHh1YonF9gsm4LIIEodfhL00rF6D2i.')
ON DUPLICATE KEY UPDATE name = VALUES(name), address = VALUES(address);

INSERT IGNORE INTO orders (id, user_id, total, status, shipping_address)
VALUES ('#PF-DEMO1', 'demo-customer', 1150, 'waiting_confirmation', '12 Demo Street, Bengaluru, 9876543210');

INSERT IGNORE INTO order_items (order_id, product_id, product_title, price, quantity)
VALUES
('#PF-DEMO1', 'product-1', 'Custom Desk Planter', 450, 1),
('#PF-DEMO1', 'product-2', 'Articulated Dragon', 700, 1);
