<?php

namespace App\Utils;

use Illuminate\Support\Facades\Log;

class Logger
{
    /**
     * Log error message
     */
    public static function error(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    /**
     * Log authentication events
     */
    public static function auth(string $action, ?int $userId = null, array $context = []): void
    {
        $context['user_id'] = $userId;
        Log::info("Auth: {$action}", $context);
    }

    /**
     * Log task operations
     */
    public static function task(string $action, ?int $taskId = null, ?int $userId = null, array $context = []): void
    {
        $context['task_id'] = $taskId;
        $context['user_id'] = $userId;
        Log::info("Task: {$action}", $context);
    }
}

