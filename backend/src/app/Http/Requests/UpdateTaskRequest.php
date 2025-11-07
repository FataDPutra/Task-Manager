<?php

namespace App\Http\Requests;

use App\Constants\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    // Rules validasi untuk update task (semua field optional)
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes', 'required', Rule::in(TaskStatus::all())],
            'deadline' => 'sometimes|required|date|after_or_equal:today',
        ];
    }

    // Pesan error custom
    public function messages(): array
    {
        return [
            'title.required' => 'Judul task wajib diisi.',
            'title.max' => 'Judul task maksimal 255 karakter.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus salah satu dari: ' . implode(', ', TaskStatus::all()),
            'deadline.required' => 'Deadline wajib diisi.',
            'deadline.date' => 'Format deadline tidak valid.',
            'deadline.after_or_equal' => 'Deadline harus hari ini atau setelahnya.',
        ];
    }
}

