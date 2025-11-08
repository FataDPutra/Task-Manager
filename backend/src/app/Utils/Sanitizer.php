<?php

namespace App\Utils;

class Sanitizer
{
    /**
     * Sanitasi input string untuk mencegah XSS attack
     *
     * @param string|null $input
     * @return string|null
     */
    public static function sanitizeString(?string $input): ?string
    {
        if ($input === null || $input === '') {
            return null;
        }

        // Strip HTML tags untuk mencegah XSS
        $sanitized = strip_tags($input);

        // Trim whitespace
        $sanitized = trim($sanitized);

        // Remove null bytes
        $sanitized = str_replace("\0", '', $sanitized);

        return $sanitized === '' ? null : $sanitized;
    }

    /**
     * Sanitasi email
     *
     * @param string $email
     * @return string
     */
    public static function sanitizeEmail(string $email): string
    {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    }

    /**
     * Sanitasi array of strings
     *
     * @param array $data
     * @param array $keys
     * @return array
     */
    public static function sanitizeArray(array $data, array $keys): array
    {
        foreach ($keys as $key) {
            if (isset($data[$key]) && is_string($data[$key])) {
                $data[$key] = self::sanitizeString($data[$key]);
            }
        }

        return $data;
    }
}

