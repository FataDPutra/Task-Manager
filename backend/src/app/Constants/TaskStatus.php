<?php

namespace App\Constants;

class TaskStatus
{
    public const TODO = 'To Do';
    public const IN_PROGRESS = 'In Progress';
    public const DONE = 'Done';

    // Ambil semua status yang tersedia
    public static function all(): array
    {
        return [
            self::TODO,
            self::IN_PROGRESS,
            self::DONE,
        ];
    }

    // Cek apakah status valid
    public static function isValid(string $status): bool
    {
        return in_array($status, self::all(), true);
    }
}

