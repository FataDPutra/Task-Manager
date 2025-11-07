<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    // Primary key untuk model ini
    protected $primaryKey = 'user_id';

    // Field yang bisa diisi secara mass assignment
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
    ];

    // Field yang disembunyikan saat di-serialize (misal untuk response JSON)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Casting untuk field tertentu
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Untuk JWT, return user ID sebagai identifier
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Custom claims untuk JWT (kosong untuk sekarang)
    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relasi ke tasks
    public function tasks()
    {
        return $this->hasMany(Task::class, 'user_id', 'user_id');
    }

    // Convert ke array untuk response API
    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
        ];
    }
}
