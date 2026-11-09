<?php
require __DIR__ . '/../vendor/autoload.php';

(\Dotenv\Dotenv::createImmutable(__DIR__ . '/../'))->load();

$adminPass = $_ENV['ADMIN_PASSWORD'] ?? null;
if (!$adminPass) {
    exit('ADMIN_PASSWORD not set\n');
}

$pdo = (new \App\Database(
    host: $_ENV['DB_HOST'],
    dbName: $_ENV['DB_NAME'],
    user: $_ENV['DB_USER'],
    password: $_ENV['DB_PASSWORD']
))->connect();


// Root admin must be the first user in database
if ((int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() > 0) {
    exit('There are already users. Nothing to do\n');
}

$domain = $_ENV['DOMAIN_NAME'] ?? 'coldplace.com';
$adminEmail = "rootadmin@{$domain}";

$pdo->prepare('INSERT INTO users (name, email, password_hash, role, must_change_password)
                VALUES (?, ?, ?, ?, 0)')
    ->execute(['Root Admin', $adminEmail, password_hash($adminPass, PASSWORD_DEFAULT), 'admin']);

echo "Root admin created successfully \n";
echo "Email: {$adminEmail}\n";