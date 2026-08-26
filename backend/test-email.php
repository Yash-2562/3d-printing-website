<?php
declare(strict_types=1);

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/services/EmailService.php';

// CLI or HTTP test
$email = $_GET['email'] ?? ($_SERVER['argv'][1] ?? null);

if (!$email) {
    echo "Usage:\n";
    echo "  CLI: php test-email.php your-email@gmail.com\n";
    echo "  HTTP: test-email.php?email=your-email@gmail.com\n";
    exit(1);
}

echo "Testing email to: {$email}\n";
echo "Sending order status email...\n\n";

$emailService = new EmailService();
$result = $emailService->sendOrderStatusEmail(
    $email,
    'Test Customer',
    '#PF-TEST-001',
    'confirmed',
    450
);

echo ($result ? "✓ Email sent successfully!\n" : "✗ Failed to send email\n");
echo "Check error logs for details\n";

