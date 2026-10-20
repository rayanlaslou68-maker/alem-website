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

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    json_error('A valid equipment id is required.', 422, 'validation');
}

$stmt = db()->prepare(
    'SELECT id, reference_code, name, category, status, description, updated_at
     FROM equipment WHERE id = ? LIMIT 1'
);
$stmt->execute([$id]);
$item = $stmt->fetch();

if (!$item) {
    json_error('Equipment record not found.', 404);
}

audit_log($user['id'], 'equipment_detail_viewed', ['equipment_id' => $id]);

json_ok(['equipment' => $item]);