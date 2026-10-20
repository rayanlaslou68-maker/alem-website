<?php
declare(strict_types=1);

require_once __DIR__ . '/../../lib/Security.php';

send_security_headers();
enforce_allowed_origin();
start_secure_session();

// Every page load calls this once, which both reports session state and
// (re)issues the CSRF cookie the SPA needs for subsequent POST requests.
issue_csrf_token();

$user = current_user();
if (!$user) {
    json_error('Not signed in.', 401, 'auth_required');
}

json_ok(['user' => $user]);