<?php
declare(strict_types=1);

require_once __DIR__ . '/config/config.php';

echo "=== SMTP Connection Test ===\n\n";
echo "Host: " . MAIL_HOST . "\n";
echo "Port: " . MAIL_PORT . "\n";
echo "Username: " . MAIL_USERNAME . "\n";
echo "Password: " . (MAIL_PASSWORD ? '***' . substr(MAIL_PASSWORD, -2) : 'NOT SET') . "\n\n";

// Test basic socket connection
echo "Attempting to connect to SMTP server...\n";

$socket = @stream_socket_client(
    "tcp://" . MAIL_HOST . ":" . MAIL_PORT,
    $errno,
    $errstr,
    10
);

if ($socket) {
    echo "✓ Connected successfully!\n\n";
    
    // Read server greeting
    $response = fgets($socket, 1024);
    echo "Server response: " . trim($response) . "\n\n";
    
    // Try EHLO
    echo "Sending EHLO...\n";
    fwrite($socket, "EHLO " . gethostname() . "\r\n");
    
    while ($line = fgets($socket, 1024)) {
        echo "  " . trim($line) . "\n";
        if (substr($line, 3, 1) === ' ') break;
    }
    
    echo "\nSending STARTTLS...\n";
    fwrite($socket, "STARTTLS\r\n");
    $starttls = fgets($socket, 1024);
    echo "  " . trim($starttls) . "\n";
    
    if (strpos($starttls, '220') !== false) {
        echo "\n✓ TLS is available\n";
        
        if (stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            echo "✓ TLS encryption enabled\n";
            
            echo "\nSending EHLO after TLS...\n";
            fwrite($socket, "EHLO " . gethostname() . "\r\n");
            
            while ($line = fgets($socket, 1024)) {
                echo "  " . trim($line) . "\n";
                if (substr($line, 3, 1) === ' ') break;
            }
            
        } else {
            echo "✗ Failed to enable TLS encryption\n";
        }
    } else {
        echo "✗ TLS not available\n";
    }
    
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
    
    echo "\n=== Test Complete ===\n";
} else {
    echo "✗ Connection failed!\n";
    echo "Error: {$errstr} ({$errno})\n\n";
    echo "This could mean:\n";
    echo "1. Gmail SMTP server is not reachable\n";
    echo "2. Port 587 is blocked by firewall\n";
    echo "3. Network connectivity issue\n";
}
