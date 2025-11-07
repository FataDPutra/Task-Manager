<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $primaryKey = 'task_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'deadline',
        'created_by',
    ];

    // Relasi ke user yang memiliki task ini
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi ke user yang membuat task ini
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }
}
