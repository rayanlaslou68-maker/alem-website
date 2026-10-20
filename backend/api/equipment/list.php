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

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT id, reference_code, name, category, status, updated_at
     FROM equipment
     ORDER BY updated_at DESC
     LIMIT 200'
);
$stmt->execute();
$rows = $stmt->fetchAll();

audit_log($user['id'], 'equipment_list_viewed', []);

json_ok(['equipment' => $rows]);