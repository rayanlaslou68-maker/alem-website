<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/Security.php';

send_security_headers();
enforce_allowed_origin();
start_secure_session();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_error('Method not allowed.', 405);
}

require_csrf(); // token was issued on first page load; see me.php

$data = json_input();
$username = require_string($data, 'username', 64);
$password = (string) ($data['password'] ?? '');
$totp = isset($data['totp']) ? preg_replace('/\D/', '', (string) $data['totp']) : null;

if ($password === '') {
    json_error('Incorrect username or password.', 401);
}

// Rate limit by IP *and* by username, so an attacker can't dodge the limit
// by spraying many usernames from one IP, or one username from many IPs
// without also being throttled per-account.
rate_limit_check('login_ip:' . client_ip(), 20, 300);
rate_limit_check('login_user:' . strtolower($username), 8, 300);
rate_limit_record('login_ip:' . client_ip());
rate_limit_record('login_user:' . strtolower($username));

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT id, username, password_hash, role, totp_secret, is_active, failed_attempts, locked_until
     FROM users WHERE username = ? LIMIT 1'
);
$stmt->execute([$username]);
$user = $stmt->fetch();

// Always run a hash verification even when the user doesn't exist, using a
// fixed dummy hash, so response timing doesn't reveal which usernames exist.
$dummyHash = '$argon2id$v=19$m=65536,t=4,p=1$c29tZXNhbHRzb21lc2FsdA$3s7Zx8u8k4l0v6Kmz1eYkOZa8W1Q0m9m3y1yQd7dQmA';
$hashToCheck = $user['password_hash'] ?? $dummyHash;
$passwordOk = password_verify($password, $hashToCheck);

if (!$user || !$passwordOk || !$user['is_active']) {
    if ($user) {
        $pdo->prepare('UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = ?')->execute([$user['id']]);
        if (($user['failed_attempts'] + 1) >= 10) {
            $pdo->prepare('UPDATE users SET locked_until = NOW() + INTERVAL 15 MINUTE WHERE id = ?')->execute([$user['id']]);
        }
    }
    audit_log($user['id'] ?? null, 'login_failed', ['username' => $username]);
    json_error('Incorrect username or password.', 401);
}

if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
    audit_log($user['id'], 'login_blocked_locked', []);
    json_error('This account is temporarily locked after repeated failed attempts.', 423);
}

if ($user['totp_secret']) {
    if (!$totp) {
        json_error('Authentication code required.', 401, 'totp_required');
    }
    require_once __DIR__ . '/../../lib/Totp.php';
    if (!totp_verify($user['totp_secret'], $totp)) {
        $pdo->prepare('UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = ?')->execute([$user['id']]);
        audit_log($user['id'], 'login_failed_totp', []);
        json_error('Incorrect authentication code.', 401);
    }
}

// Success: reset lockout counters, rotate session ID to prevent fixation.
$pdo->prepare('UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?')
    ->execute([$user['id']]);

session_regenerate_id(true);
$_SESSION['user'] = [
    'id' => (int) $user['id'],
    'username' => $user['username'],
    'role' => $user['role'],
];
$_SESSION['_started_at'] = time();

audit_log($user['id'], 'login_success', []);

json_ok(['user' => $_SESSION['user']]);