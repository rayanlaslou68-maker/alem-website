<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

function send_inquiry_email(string $name, string $org, string $email, string $message): bool
{
    $user = getenv('MAIL_USER');
    $pass = getenv('MAIL_PASS');
    $to = getenv('MAIL_TO') ?: $user;
    if (!$user || !$pass || !$to) {
        error_log('ALEM: mail credentials are not set.');
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

        $mail->setFrom($user, 'ALEM Website');
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);

        $mail->Subject = 'New ALEM inquiry from ' . preg_replace('/[\r\n]+/', ' ', $name);
        $mail->Body = "Name: $name\nOrganization: $org\nEmail: $email\n\nMessage:\n$message\n";
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('ALEM mail error: ' . $mail->ErrorInfo);
        return false;
    }
}