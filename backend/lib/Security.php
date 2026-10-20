<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

/**
 * Shared security helpers used by every API endpoint. Centralizing this
 * means a fix here (e.g. tightening a header) applies everywhere at once,
 * instead of being copy-pasted and drifting between endpoints.
 */

function send_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Cross-Origin-Resource-Policy: same-origin');
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    if ((getenv('SESSION_SECURE') ?: '1') === '1') {
        header('Strict-Transport-Security: max-age=63072000; includeSubDomains');
    }
}

function enforce_allowed_origin(): void
{
    $allowed = getenv('ALLOWED_ORIGIN');
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    if ($allowed && $origin && $origin !== $allowed) {
        json_error('Origin not permitted.', 403);
    }
}

function start_secure_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (getenv('SESSION_SECURE') ?: '1') === '1';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('alem_session');
    session_start();

    if (!isset($_SESSION['_started_at'])) {
        $_SESSION['_started_at'] = time();
    } elseif (time() - $_SESSION['_started_at'] > 900) {
        session_regenerate_id(true);
        $_SESSION['_started_at'] = time();
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Malformed request body.', 400);
    }
    return $data;
}

function json_ok(array $payload = [], int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload + ['ok' => true]);
    exit;
}

function json_error(string $message, int $status = 400, ?string $code = null): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $message, 'code' => $code]);
    exit;
}

function issue_csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    setcookie('csrf_token', $_SESSION['csrf_token'], [
        'expires' => 0,
        'path' => '/',
        'secure' => (getenv('SESSION_SECURE') ?: '1') === '1',
        'httponly' => false,
        'samesite' => 'Strict',
    ]);
    return $_SESSION['csrf_token'];
}

function require_csrf(): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) {
        return;
    }
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if ($expected === '' || !hash_equals($expected, $sent)) {
        json_error('Invalid or missing CSRF token.', 403, 'csrf_invalid');
    }
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function require_auth(): array
{
    $user = current_user();
    if (!$user) {
        json_error('Authentication required.', 401, 'auth_required');
    }
    return $user;
}

function require_role(array $roles): array
{
    $user = require_auth();
    if (!in_array($user['role'], $roles, true)) {
        json_error('You do not have access to this resource.', 403, 'forbidden');
    }
    return $user;
}

function rate_limit_check(string $key, int $maxAttempts, int $windowSeconds): void
{
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM rate_limit_hits WHERE rate_key = ? AND created_at > (NOW() - INTERVAL ? SECOND)'
    );
    $stmt->execute([$key, $windowSeconds]);
    $count = (int) $stmt->fetchColumn();
    if ($count >= $maxAttempts) {
        json_error('Too many attempts. Please wait and try again.', 429, 'rate_limited');
    }
}

function rate_limit_record(string $key): void
{
    $stmt = db()->prepare('INSERT INTO rate_limit_hits (rate_key, created_at) VALUES (?, NOW())');
    $stmt->execute([$key]);
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function audit_log(?int $userId, string $action, array $context = []): void
{
    $stmt = db()->prepare(
        'INSERT INTO audit_log (user_id, action, context, ip_address, created_at) VALUES (?, ?, ?, ?, NOW())'
    );
    $stmt->execute([$userId, $action, json_encode($context), client_ip()]);
}

function require_string(array $data, string $field, int $maxLen = 255, bool $required = true): string
{
    $value = trim((string) ($data[$field] ?? ''));
    if ($required && $value === '') {
        json_error("Field '{$field}' is required.", 422, 'validation');
    }
    if (mb_strlen($value) > $maxLen) {
        json_error("Field '{$field}' is too long.", 422, 'validation');
    }
    return $value;
}