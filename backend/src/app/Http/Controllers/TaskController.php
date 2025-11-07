<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Services\TaskService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use ApiResponse;

    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    // Ambil semua task user dengan filter dan sorting
    public function index(Request $request)
    {
        $userId = auth()->id();
        $tasks = $this->taskService->getUserTasks($request, $userId);

        return $this->successResponse($tasks);
    }

    // Buat task baru
    public function store(StoreTaskRequest $request)
    {
        $userId = auth()->id();
        $task = $this->taskService->createTask($request->validated(), $userId);

        return $this->successResponse($task, 'Task created successfully', 201);
    }

    // Ambil detail task berdasarkan ID
    public function show($id)
    {
        $userId = auth()->id();
        $task = $this->taskService->getUserTask($id, $userId);

        if (!$task) {
            return $this->notFoundResponse('Task not found');
        }

        return $this->successResponse($task);
    }

    // Update task
    public function update(UpdateTaskRequest $request, $id)
    {
        $userId = auth()->id();
        $task = $this->taskService->getUserTask($id, $userId);

        if (!$task) {
            return $this->notFoundResponse('Task not found');
        }

        $updatedTask = $this->taskService->updateTask($task, $request->validated());

        return $this->successResponse($updatedTask, 'Task updated successfully');
    }

    // Hapus task
    public function destroy($id)
    {
        $userId = auth()->id();
        $task = $this->taskService->getUserTask($id, $userId);

        if (!$task) {
            return $this->notFoundResponse('Task not found');
        }

        $this->taskService->deleteTask($task);

        return $this->successResponse(null, 'Task deleted successfully');
    }
}

