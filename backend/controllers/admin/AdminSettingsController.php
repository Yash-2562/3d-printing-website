<?php
declare(strict_types=1);

require_once __DIR__ . '/../../support/DatabaseSetup.php';

function adminSettings(): void
{
    ensureStoreSettingsTable();
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = body();
        $statement = db()->prepare('INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        foreach ($input as $key => $value) if (is_string($key) && preg_match('/^[A-Za-z][A-Za-z0-9]{0,79}$/', $key)) $statement->execute([$key, is_bool($value) ? ($value ? '1' : '0') : trim((string) $value)]);
    }
    $settings = [];
    foreach (db()->query('SELECT setting_key, setting_value FROM store_settings') as $row) $settings[$row['setting_key']] = in_array($row['setting_value'], ['0', '1'], true) ? $row['setting_value'] === '1' : $row['setting_value'];
    respond(['data' => $settings, 'message' => $_SERVER['REQUEST_METHOD'] === 'PUT' ? 'Settings saved' : null]);
}
