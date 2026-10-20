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

// Documents can be scoped to a minimum role via `min_role`; admins see
// everything, others see only what their role is cleared for.
$stmt = db()->prepare(
    "SELECT id, title, category, updated_at
     FROM documents
     WHERE :role = 'admin' OR FIND_IN_SET(:role2, cleared_roles)
     ORDER BY updated_at DESC
     LIMIT 200"
);
$stmt->execute(['role' => $user['role'], 'role2' => $user['role']]);
$rows = $stmt->fetchAll();

audit_log($user['id'], 'documents_list_viewed', []);

json_ok(['documents' => $rows]);