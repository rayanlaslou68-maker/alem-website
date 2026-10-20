<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/Security.php';

send_security_headers();
enforce_allowed_origin();
start_secure_session();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    json_error('Method not allowed.', 405);
}

$user = require_role(['military', 'authority', 'admin']);

if ($user['role'] === 'admin') {
    $stmt = db()->prepare(
        'SELECT id, name, subject, message, status, source, created_at
         FROM inquiries ORDER BY created_at DESC LIMIT 200'
    );
    $stmt->execute();
} else {
    $stmt = db()->prepare(
        'SELECT id, name, subject, message, status, source, created_at
         FROM inquiries WHERE user_id = ? ORDER BY created_at DESC LIMIT 200'
    );
    $stmt->execute([$user['id']]);
}

json_ok(['inquiries' => $stmt->fetchAll()]);