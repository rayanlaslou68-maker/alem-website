<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/Security.php';
require_once __DIR__ . '/../../lib/Mailer.php';

send_security_headers();
enforce_allowed_origin();
start_secure_session();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_error('Method not allowed.', 405);
}

$user = current_user();
if ($user) {
    // Authenticated (portal) submissions carry session privilege, so they
    // must be CSRF-checked.
    require_csrf();
}

rate_limit_check('inquiry_ip:' . client_ip(), 10, 600);
rate_limit_record('inquiry_ip:' . client_ip());

$data = json_input();

if ($user) {
    $subject = require_string($data, 'subject', 140);
    $message = require_string($data, 'message', 2000);
    $name = $user['username'];
    $email = null;
    $organization = null;
} else {
    // Honeypot: a hidden field real browsers never fill in.
    if (trim((string) ($data['company_website'] ?? '')) !== '') {
        audit_log(null, 'inquiry_honeypot_tripped', []);
        json_ok(['inquiry' => null]); // pretend success, don't tip off bots
    }
    $name = require_string($data, 'name', 80);
    $email = require_string($data, 'email', 120);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('Enter a valid email address.', 422, 'validation');
    }
    $organization = require_string($data, 'organization', 120, false);
    $message = require_string($data, 'message', 2000);
    $subject = 'Website contact form';
}

$stmt = db()->prepare(
    'INSERT INTO inquiries (user_id, name, email, organization, subject, message, source, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, "open", NOW())'
);
$stmt->execute([
    $user['id'] ?? null,
    $name,
    $email,
    $organization,
    $subject,
    $message,
    $user ? 'portal' : 'public',
]);
$id = (int) db()->lastInsertId();

audit_log($user['id'] ?? null, 'inquiry_submitted', ['inquiry_id' => $id]);

// Send the inquiry to Gmail (public contact form only).
// If sending fails, the message is already saved in the database.
if (!$user && $email !== null) {
    try {
        send_inquiry_email(
            (string) $name,
            (string) ($organization ?? ''),
            (string) $email,
            (string) $message
        );
    } catch (\Throwable $e) {
        error_log('ALEM mail error: ' . $e->getMessage());
    }
}

$stmt = db()->prepare('SELECT id, subject, message, status, created_at FROM inquiries WHERE id = ?');
$stmt->execute([$id]);

json_ok(['inquiry' => $stmt->fetch()], 201);