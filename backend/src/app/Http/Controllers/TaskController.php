<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Services\TaskService;
use App\Traits\ApiResponse;
use App\Utils\Logger;
use Exception;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use ApiResponse;

    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Ambil semua task user dengan filter dan sorting
     */
    public function index(Request $request)
    {
        try {
            $tasks = $this->taskService->getUserTasks($request, auth()->id());
            return $this->successResponse($tasks);
        } catch (Exception $e) {
            Logger::error('Get tasks failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal mengambil daftar task', 500);
        }
    }

    /**
     * Buat task baru
     */
    public function store(StoreTaskRequest $request)
    {
        try {
            $task = $this->taskService->createTask($request->validated(), auth()->id());
            return $this->successResponse($task, 'Task berhasil dibuat', 201);
        } catch (Exception $e) {
            Logger::error('Create task failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal membuat task', 500);
        }
    }

    /**
     * Ambil detail task berdasarkan ID
     */
    public function show($id)
    {
        try {
            $task = $this->findTaskOrFail((int) $id);
            if (!$task) {
                return $this->notFoundResponse('Task tidak ditemukan');
            }
            return $this->successResponse($task);
        } catch (Exception $e) {
            Logger::error('Get task failed', ['error' => $e->getMessage(), 'task_id' => $id]);
            return $this->errorResponse('Gagal mengambil detail task', 500);
        }
    }

    /**
     * Update task
     */
    public function update(UpdateTaskRequest $request, $id)
    {
        try {
            $task = $this->findTaskOrFail((int) $id);
            if (!$task) {
                return $this->notFoundResponse('Task tidak ditemukan');
            }
            $updatedTask = $this->taskService->updateTask($task, $request->validated());
            return $this->successResponse($updatedTask, 'Task updated successfully');
        } catch (Exception $e) {
            Logger::error('Update task failed', ['error' => $e->getMessage(), 'task_id' => $id]);
            return $this->errorResponse('Gagal mengupdate task', 500);
        }
    }

    /**
     * Hapus task
     */
    public function destroy($id)
    {
        try {
            $task = $this->findTaskOrFail((int) $id);
            if (!$task) {
                return $this->notFoundResponse('Task tidak ditemukan');
            }
            $this->taskService->deleteTask($task);
            return $this->successResponse(null, 'Task berhasil dihapus');
        } catch (Exception $e) {
            Logger::error('Delete task failed', ['error' => $e->getMessage(), 'task_id' => $id]);
            return $this->errorResponse('Gagal menghapus task', 500);
        }
    }

    /**
     * Cari task berdasarkan ID atau return null
     */
    private function findTaskOrFail(int $taskId)
    {
        $task = $this->taskService->getUserTask($taskId, auth()->id());
        
        if (!$task) {
            return null;
        }

        return $task;
    }
}

