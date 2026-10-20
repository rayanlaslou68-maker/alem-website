<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/Security.php';

send_security_headers();
enforce_allowed_origin();
start_secure_session();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_error('Method not allowed.', 405);
}
require_csrf();

$user = current_user();
if ($user) {
    audit_log($user['id'], 'logout', []);
}

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();

// Also clear the (non-httpOnly) CSRF cookie so a stale token can't linger.
setcookie('csrf_token', '', time() - 42000, '/');

json_ok();