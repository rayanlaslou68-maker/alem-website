<?php
declare(strict_types=1);

/**
 * Minimal RFC 6238 TOTP check against a base32 secret (compatible with
 * Google Authenticator / Authy). Accepts the current step and one step of
 * clock drift on either side.
 */
function totp_verify(string $base32Secret, string $code, int $window = 1, int $step = 30): bool
{
    $secret = base32_decode($base32Secret);
    if ($secret === '' || !preg_match('/^\d{6}$/', $code)) {
        return false;
    }
    $currentStep = (int) floor(time() / $step);
    for ($i = -$window; $i <= $window; $i++) {
        if (hash_equals(totp_generate($secret, $currentStep + $i), $code)) {
            return true;
        }
    }
    return false;
}

function totp_generate(string $secretBinary, int $counter): string
{
    $bin = pack('N*', 0) . pack('N*', $counter); // 8-byte big-endian counter
    $hash = hash_hmac('sha1', $bin, $secretBinary, true);
    $offset = ord($hash[19]) & 0x0f;
    $truncated = ((ord($hash[$offset]) & 0x7f) << 24)
        | ((ord($hash[$offset + 1]) & 0xff) << 16)
        | ((ord($hash[$offset + 2]) & 0xff) << 8)
        | (ord($hash[$offset + 3]) & 0xff);
    return str_pad((string) ($truncated % 1000000), 6, '0', STR_PAD_LEFT);
}

function base32_decode(string $b32): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $b32 = strtoupper(preg_replace('/[^A-Z2-7]/i', '', $b32));
    $bits = '';
    foreach (str_split($b32) as $char) {
        $pos = strpos($alphabet, $char);
        if ($pos === false) {
            continue;
        }
        $bits .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT);
    }
    $bytes = '';
    foreach (str_split($bits, 8) as $byte) {
        if (strlen($byte) === 8) {
            $bytes .= chr(bindec($byte));
        }
    }
    return $bytes;
}