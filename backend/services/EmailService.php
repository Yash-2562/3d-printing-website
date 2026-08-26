<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

class EmailService
{
    private string $host;
    private int $port;
    private string $username;
    private string $password;
    private string $fromName;
    private $socket;

    public function __construct()
    {
        $this->host = MAIL_HOST;
        $this->port = (int) MAIL_PORT;
        $this->username = MAIL_USERNAME;
        $this->password = MAIL_PASSWORD;
        $this->fromName = MAIL_FROM_NAME;
        $this->socket = null;
    }

    /**
     * Send email via direct SMTP connection
     */
    public function send(string $to, string $subject, string $body, bool $isHtml = true): bool
    {
        if (empty($this->username) || empty($this->password)) {
            error_log('Email service not configured. Missing MAIL_USERNAME or MAIL_PASSWORD.');
            return false;
        }

        try {
            // Connect to SMTP server with timeout
            if (!$this->connectSMTP()) {
                error_log("Failed to connect to SMTP server {$this->host}:{$this->port}");
                return false;
            }

            $from = $this->username;
            $fromHeader = $this->fromName . " <{$from}>";

            // SMTP commands
            if (!$this->sendCommand("EHLO " . gethostname())) {
                error_log("EHLO command failed");
                $this->closeSMTP();
                return false;
            }

            // Start TLS encryption with proper flushing
            if (!$this->upgradeToTLS()) {
                error_log("TLS upgrade failed");
                $this->closeSMTP();
                return false;
            }

            // Repeat EHLO after TLS
            if (!$this->sendCommand("EHLO " . gethostname())) {
                error_log("EHLO after TLS failed");
                $this->closeSMTP();
                return false;
            }

            // Authenticate
            if (!$this->authenticate()) {
                error_log("Authentication failed");
                $this->closeSMTP();
                return false;
            }

            // Send mail
            if (!$this->sendCommand("MAIL FROM:<{$from}>")) {
                error_log("MAIL FROM failed");
                $this->closeSMTP();
                return false;
            }

            if (!$this->sendCommand("RCPT TO:<{$to}>")) {
                error_log("RCPT TO failed");
                $this->closeSMTP();
                return false;
            }

            if (!$this->sendCommand("DATA")) {
                error_log("DATA command failed");
                $this->closeSMTP();
                return false;
            }

            // Build email message
            $contentType = $isHtml ? 'text/html' : 'text/plain';
            $message = "From: {$fromHeader}\r\n";
            $message .= "To: {$to}\r\n";
            $message .= "Subject: {$subject}\r\n";
            $message .= "MIME-Version: 1.0\r\n";
            $message .= "Content-Type: {$contentType}; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 8bit\r\n";
            $message .= "X-Mailer: PocketForm Email Service\r\n";
            $message .= "\r\n";
            $message .= $body;
            $message .= "\r\n.\r\n";

            // Send message
            fwrite($this->socket, $message);
            $response = fgets($this->socket, 1024);

            if (strpos($response, '250') === false) {
                error_log("Failed to send message: {$response}");
                $this->closeSMTP();
                return false;
            }

            // Quit
            $this->sendCommand("QUIT");
            $this->closeSMTP();

            error_log("Email sent successfully to {$to}");
            return true;

        } catch (Exception $e) {
            error_log("Email service error: " . $e->getMessage());
            $this->closeSMTP();
            return false;
        }
    }

    /**
     * Upgrade connection to TLS
     */
    private function upgradeToTLS(): bool
    {
        if (!$this->socket) {
            return false;
        }

        // Send STARTTLS command
        fwrite($this->socket, "STARTTLS\r\n");
        fflush($this->socket);
        
        $response = '';
        while ($line = fgets($this->socket, 1024)) {
            $response .= $line;
            if (preg_match('/^\d{3} /', $line)) {
                break;
            }
        }

        if (strpos($response, '220') === false) {
            error_log("STARTTLS not supported: {$response}");
            return false;
        }

        // Enable crypto with proper error suppression and retry
        $attempts = 0;
        while ($attempts < 3) {
            $result = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($result === true) {
                return true;
            } elseif ($result === false) {
                error_log("TLS crypto enable failed on attempt " . ($attempts + 1));
                sleep(1);
                $attempts++;
            } else {
                // Still in progress
                sleep(1);
                $attempts++;
            }
        }

        return false;
    }

    /**
     * Authenticate with SMTP server
     */
    private function authenticate(): bool
    {
        if (!$this->socket) {
            return false;
        }

        // Send AUTH LOGIN
        fwrite($this->socket, "AUTH LOGIN\r\n");
        fflush($this->socket);
        $response = fgets($this->socket, 1024);
        
        if (strpos($response, '334') === false) {
            error_log("AUTH LOGIN not supported: {$response}");
            return false;
        }

        // Send username (base64 encoded)
        fwrite($this->socket, base64_encode($this->username) . "\r\n");
        fflush($this->socket);
        $response = fgets($this->socket, 1024);
        
        if (strpos($response, '334') === false) {
            error_log("Username authentication failed: {$response}");
            return false;
        }

        // Send password (base64 encoded)
        fwrite($this->socket, base64_encode($this->password) . "\r\n");
        fflush($this->socket);
        $response = fgets($this->socket, 1024);
        
        if (strpos($response, '235') === false && strpos($response, '250') === false) {
            error_log("Password authentication failed: {$response}");
            return false;
        }

        return true;
    }

    /**
     * Connect to SMTP server
     */
    private function connectSMTP(): bool
    {
        $streamContext = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ]
        ]);

        $this->socket = @stream_socket_client(
            "tcp://{$this->host}:{$this->port}",
            $errno,
            $errstr,
            10,
            STREAM_CLIENT_CONNECT,
            $streamContext
        );

        if (!$this->socket) {
            error_log("SMTP connection error: {$errstr} ({$errno})");
            return false;
        }

        // Read greeting
        $response = fgets($this->socket, 1024);
        if (strpos($response, '220') === false) {
            error_log("Invalid SMTP greeting: {$response}");
            fclose($this->socket);
            $this->socket = null;
            return false;
        }

        return true;
    }

    /**
     * Send SMTP command
     */
    private function sendCommand(string $command): bool
    {
        if (!$this->socket) {
            return false;
        }

        fwrite($this->socket, $command . "\r\n");
        fflush($this->socket);
        
        // Read responses (handle multi-line responses)
        $response = '';
        while ($line = fgets($this->socket, 1024)) {
            $response .= $line;
            // Multi-line response ends with a space (e.g., "250 " not "250-")
            if (preg_match('/^\d{3} /', $line)) {
                break;
            }
        }

        // Check for success codes (220, 221, 250, 235, 354)
        if (preg_match('/^(220|221|250|235|354)/', $response)) {
            return true;
        }

        error_log("SMTP command failed: {$command} - Response: {$response}");
        return false;
    }

    /**
     * Close SMTP connection
     */
    private function closeSMTP(): void
    {
        if ($this->socket) {
            @fclose($this->socket);
            $this->socket = null;
        }
    }

    /**
     * Send order status update notification email
     */
    public function sendOrderStatusEmail(string $customerEmail, string $customerName, string $orderId, string $status, float $amount): bool
    {
        // Map status to human-readable format
        $statusLabels = [
            'waiting_confirmation' => 'Waiting for Confirmation',
            'confirmed' => 'Confirmed',
            'printing_started' => 'Printing Started',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled'
        ];

        $statusLabel = $statusLabels[$status] ?? ucfirst(str_replace('_', ' ', $status));
        
        // Status color for email visual
        $statusColors = [
            'waiting_confirmation' => '#FFA500',
            'confirmed' => '#4CAF50',
            'printing_started' => '#2196F3',
            'shipped' => '#9C27B0',
            'delivered' => '#4CAF50',
            'cancelled' => '#F44336'
        ];

        $statusColor = $statusColors[$status] ?? '#333333';

        $subject = "Order #{$orderId} - Status Update: {$statusLabel}";

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
        .content { padding: 20px 0; }
        .status-badge { display: inline-block; background-color: {$statusColor}; color: white; padding: 10px 15px; border-radius: 5px; font-weight: bold; }
        .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
        .detail-row:last-child { border-bottom: none; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0; }
        .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Order Status Update</h2>
            <p>Hello <strong>{$customerName}</strong>,</p>
        </div>

        <div class="content">
            <p>We're excited to inform you that your order has been updated!</p>
            
            <p style="text-align: center; margin: 20px 0;">
                <span class="status-badge">{$statusLabel}</span>
            </p>

            <div class="order-details">
                <div class="detail-row">
                    <strong>Order ID:</strong>
                    <span>#{$orderId}</span>
                </div>
                <div class="detail-row">
                    <strong>Current Status:</strong>
                    <span>{$statusLabel}</span>
                </div>
                <div class="detail-row">
                    <strong>Order Amount:</strong>
                    <span>₹{$amount}</span>
                </div>
                <div class="detail-row">
                    <strong>Updated At:</strong>
                    <span>{$this->getCurrentDate()}</span>
                </div>
            </div>

            <p>Thank you for your business! If you have any questions, please don't hesitate to contact us.</p>
        </div>

        <div class="footer">
            <p>© 2026 PocketForm. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
HTML;

        return $this->send($customerEmail, $subject, $htmlBody, true);
    }

    /**
     * Get current date in readable format
     */
    private function getCurrentDate(): string
    {
        return date('d M Y, h:i A');
    }
}

// Export function for easier use
function sendOrderStatusNotification(string $customerEmail, string $customerName, string $orderId, string $status, float $amount): bool
{
    $emailService = new EmailService();
    return $emailService->sendOrderStatusEmail($customerEmail, $customerName, $orderId, $status, $amount);
}
