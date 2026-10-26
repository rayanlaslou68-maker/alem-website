    <?php
require __DIR__ . '/Mailer.php';

ini_set('log_errors', '1');
ini_set('error_log', 'php://stderr');   // l-erreur tban f terminal

$ok = send_inquiry_email('Test', 'NIKE', 'a@b.com', 'hello');
echo $ok ? "OK\n" : "FAILED (chouf l-ligne 'ALEM mail error' foug)\n";