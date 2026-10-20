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
    json_error('A valid document id is required.', 422, 'validation');
}

$stmt = db()->prepare(
    "SELECT id, title, storage_filename, cleared_roles
     FROM documents WHERE id = ? LIMIT 1"
);
$stmt->execute([$id]);
$doc = $stmt->fetch();

if (!$doc) {
    json_error('Document not found.', 404);
}

$clearedRoles = array_filter(explode(',', (string) $doc['cleared_roles']));
if ($user['role'] !== 'admin' && !in_array($user['role'], $clearedRoles, true)) {
    audit_log($user['id'], 'document_download_denied', ['document_id' => $id]);
    json_error('You are not cleared to view this document.', 403);
}

// The filename stored in the DB is never taken from user input, and the
// storage root lives outside the public webroot entirely, so there is no
// path a client can supply to escape it (no ../, no absolute path — the
// client never supplies a path at all, only an integer id).
$storageRoot = rtrim((string) getenv('DOCUMENT_STORAGE_PATH'), '/');
if ($storageRoot === '') {
    error_log('ALEM: DOCUMENT_STORAGE_PATH is not configured.');
    json_error('Server configuration error.', 500);
}

$safeName = basename($doc['storage_filename']); // defense in depth, even though this is DB-controlled
$fullPath = $storageRoot . '/' . $safeName;
$realPath = realpath($fullPath);
$realRoot = realpath($storageRoot);

if ($realPath === false || $realRoot === false || !str_starts_with($realPath, $realRoot)) {
    error_log("ALEM: document {$id} resolved outside storage root.");
    json_error('Document not found.', 404);
}

audit_log($user['id'], 'document_downloaded', ['document_id' => $id]);

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . rawurlencode($doc['title']) . '"');
header('Content-Length: ' . filesize($realPath));
header('X-Content-Type-Options: nosniff');
readfile($realPath);
exit;