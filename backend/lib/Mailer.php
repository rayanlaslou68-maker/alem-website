<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

/**
 * Kay9ra backend/.env (KEY=VALUE) w kay7ett l-valeurs f getenv().
 * Ma kaybeddelch variable li deja kayna f l-environnement.
 */
function alem_load_env(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;

    $file = __DIR__ . '/../.env';
    if (!is_file($file) || !is_readable($file)) {
        return;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        // 7yed quotes ila kaynin
        if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && $value[-1] === $value[0]) {
            $value = substr($value, 1, -1);
        }
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

function send_inquiry_email(string $name, string $org, string $email, string $message): bool
{
    alem_load_env();

    $user = trim((string) getenv('MAIL_USER'));
    // Google kay3ti App Password b fragat (xxxx xxxx xxxx xxxx), kan7iydouhom
    $pass = str_replace(' ', '', (string) getenv('MAIL_PASS'));
    $to = trim((string) getenv('MAIL_TO')) ?: $user;

    if ($user === '' || $pass === '' || $to === '') {
        error_log('ALEM: mail credentials are not set (chouf backend/.env).');
        return false;
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        $mail->Timeout = 15;

        $mail->setFrom($user, 'ALEM Website');
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);

        $mail->Subject = 'New ALEM inquiry from ' . preg_replace('/[\r\n]+/', ' ', $name);
        $mail->Body = "Name: $name\nOrganization: $org\nEmail: $email\n\nMessage:\n$message\n";
        $mail->send();
        return true;
    } catch (\Throwable $e) {
        error_log('ALEM mail error: ' . ($mail->ErrorInfo ?: $e->getMessage()));
        return false;
    }
}