<?php
declare(strict_types=1);

/**
 * Database connection.
 *
 * Credentials come only from environment variables, never from a file
 * committed to the repo. Copy env.example.php -> set real values as actual
 * server environment variables (Apache SetEnv, PHP-FPM pool config, or your
 * host's secrets manager) — do not hardcode secrets here.
 */

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $name = getenv('DB_NAME') ?: 'alem';
    $user = getenv('DB_USER');
    $pass = getenv('DB_PASS');

    if (!$user || $pass === false) {
        http_response_code(500);
        error_log('ALEM: database credentials are not set in the environment.');
        exit(json_encode(['error' => 'Server configuration error.']));
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false, // real prepared statements, not string interpolation
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET sql_mode = 'STRICT_ALL_TABLES,NO_ENGINE_SUBSTITUTION'",
    ]);

    return $pdo;
}