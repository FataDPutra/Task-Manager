<?php

namespace App\Services;

use App\Models\User;
use App\Utils\Logger;
use App\Utils\Sanitizer;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    /**
     * Register user baru dan generate token
     */
    public function register(array $data): array
    {
        $sanitizedData = Sanitizer::sanitizeArray($data, ['name', 'username']);
        $sanitizedData['email'] = Sanitizer::sanitizeEmail($data['email']);

        $user = User::create([
            'name' => $sanitizedData['name'],
            'username' => $sanitizedData['username'],
            'email' => $sanitizedData['email'],
            'password' => Hash::make($data['password']),
        ]);

        Logger::auth('User registered', $user->user_id, ['email' => $user->email]);

        return $this->buildAuthResponse($user, JWTAuth::fromUser($user));
    }

    /**
     * Login user, return null kalau credentials salah
     */
    public function login(array $credentials): ?array
    {
        if (!$token = JWTAuth::attempt($credentials)) {
            Logger::auth('Login failed', null, ['email' => $credentials['email'] ?? null]);
            return null;
        }

        $user = auth()->user();
        Logger::auth('User logged in', $user->user_id, ['email' => $user->email]);

        return $this->buildAuthResponse($user, $token);
    }

    /**
     * Build response untuk auth (register/login)
     */
    private function buildAuthResponse(User $user, string $token): array
    {
        return [
            'user' => $user->toArray(),
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * Logout dan invalidate token JWT
     */
    public function logout(): void
    {
        $user = auth()->user();
        $userId = $user ? $user->user_id : null;

        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            Logger::auth('User logged out', $userId);
        } catch (\Exception $e) {
            Logger::error('Logout error', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}

