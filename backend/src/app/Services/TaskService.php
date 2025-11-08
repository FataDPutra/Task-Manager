<?php

namespace App\Services;

use App\Constants\TaskStatus;
use App\Models\Task;
use App\Utils\Logger;
use App\Utils\Sanitizer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class TaskService
{
    /**
     * Ambil semua task user dengan filter status, tanggal deadline, dan sorting
     */
    public function getUserTasks(Request $request, int $userId): Collection
    {
        $query = Task::where('user_id', $userId);

        // Filter berdasarkan status kalau ada
        if ($request->filled('status')) {
            $status = $request->get('status');
            if (TaskStatus::isValid($status)) {
                $query->where('status', $status);
            }
        }

        // Filter berdasarkan tanggal deadline (dari)
        if ($request->filled('deadline_from')) {
            $query->where('deadline', '>=', $request->get('deadline_from'));
        }

        // Filter berdasarkan tanggal deadline (sampai)
        if ($request->filled('deadline_to')) {
            $query->where('deadline', '<=', $request->get('deadline_to'));
        }

        // Sorting berdasarkan deadline, default ascending
        $sort = $this->getValidSort($request->get('sort', 'asc'));
        $query->orderBy('deadline', $sort);
        $query->orderBy('created_at', 'desc');

        return $query->get();
    }

    /**
     * Buat task baru
     */
    public function createTask(array $data, int $userId): Task
    {
        // Sanitasi input
        $sanitizedData = Sanitizer::sanitizeArray($data, ['title', 'description']);

        $task = Task::create([
            'user_id' => $userId,
            'title' => $sanitizedData['title'],
            'description' => $sanitizedData['description'] ?? null,
            'status' => $data['status'] ?? TaskStatus::TODO,
            'deadline' => $data['deadline'],
            'created_by' => $userId,
        ]);

        Logger::task('Task created', $task->task_id, $userId);

        return $task;
    }

    /**
     * Ambil task berdasarkan ID, pastikan milik user yang bersangkutan
     */
    public function getUserTask(int $taskId, int $userId): ?Task
    {
        return Task::with('creator')
            ->where('task_id', $taskId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Update task
     */
    public function updateTask(Task $task, array $data): Task
    {
        // Pastikan field yang tidak boleh diubah tidak di-update
        unset($data['created_at'], $data['created_by'], $data['user_id']);

        // Sanitasi input untuk mencegah XSS
        $sanitizedData = Sanitizer::sanitizeArray($data, ['title', 'description']);

        $task->update($sanitizedData);

        Logger::task('Task updated', $task->task_id, $task->user_id);

        return $task->fresh();
    }

    /**
     * Hapus task
     */
    public function deleteTask(Task $task): bool
    {
        $taskId = $task->task_id;
        $userId = $task->user_id;
        $deleted = $task->delete();

        if ($deleted) {
            Logger::task('Task deleted', $taskId, $userId);
        }

        return $deleted;
    }

    /**
     * Validasi sort direction
     */
    private function getValidSort(string $sort): string
    {
        $normalizedSort = strtolower(trim($sort));
        return in_array($normalizedSort, ['asc', 'desc'], true) ? $normalizedSort : 'asc';
    }
}

