<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use App\Utils\Logger;
use Exception;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register user baru
     */
    public function register(RegisterRequest $request)
    {
        try {
            $data = $this->authService->register($request->validated());
            return $this->successResponse($data, 'User berhasil terdaftar', 201);
        } catch (Exception $e) {
            Logger::error('Registration failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Registrasi gagal. Silakan coba lagi.', 500);
        }
    }

    /**
     * Login user dan generate token
     */
    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login($request->only('email', 'password'));

            if (!$result) {
                return $this->unauthorizedResponse('Email atau password salah');
            }

            return $this->successResponse($result, 'Berhasil login');
        } catch (Exception $e) {
            Logger::error('Login failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Login gagal. Silakan coba lagi.', 500);
        }
    }

    /**
     * Ambil data user yang sedang login
     */
    public function me()
    {
        try {
            $user = auth()->user();
            return $this->successResponse(['user' => $user->toArray()]);
        } catch (Exception $e) {
            Logger::error('Get user failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Gagal mengambil data user', 500);
        }
    }

    /**
     * Logout dan invalidate token
     */
    public function logout()
    {
        try {
            $this->authService->logout();
        } catch (Exception $e) {
            Logger::error('Logout failed', ['error' => $e->getMessage()]);
        }

        return $this->successResponse(null, 'Berhasil logout');
    }
}

