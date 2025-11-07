<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    // Register user baru dan generate token
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'user' => $user->toArray(),
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    // Login user, return null kalau credentials salah
    public function login(array $credentials): ?array
    {
        if (!$token = JWTAuth::attempt($credentials)) {
            return null;
        }

        $user = auth()->user();

        return [
            'user' => $user->toArray(),
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    // Logout dan invalidate token JWT
    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}

