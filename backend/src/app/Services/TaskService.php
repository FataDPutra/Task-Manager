<?php

namespace App\Services;

use App\Constants\TaskStatus;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class TaskService
{
    // Ambil semua task user dengan filter status dan sorting deadline
    public function getUserTasks(Request $request, int $userId): Collection
    {
        $query = Task::where('user_id', $userId);

        // Filter berdasarkan status kalau ada
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting berdasarkan deadline, default ascending
        $sort = $this->getValidSort($request->get('sort', 'asc'));
        $query->orderBy('deadline', $sort);
        $query->orderBy('created_at', 'desc');

        return $query->get();
    }

    // Buat task baru
    public function createTask(array $data, int $userId): Task
    {
        return Task::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? TaskStatus::TODO,
            'deadline' => $data['deadline'],
            'created_by' => $userId,
        ]);
    }

    // Ambil task berdasarkan ID, pastikan milik user yang bersangkutan
    public function getUserTask(int $taskId, int $userId): ?Task
    {
        return Task::where('task_id', $taskId)
            ->where('user_id', $userId)
            ->first();
    }

    // Update task
    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    // Hapus task
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }

    // Validasi sort direction, default ke 'asc' kalau tidak valid
    private function getValidSort(string $sort): string
    {
        return in_array(strtolower($sort), ['asc', 'desc'], true) ? strtolower($sort) : 'asc';
    }
}

