<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // Register user baru
    public function register(RegisterRequest $request)
    {
        $data = $this->authService->register($request->validated());

        return $this->successResponse($data, 'User registered successfully', 201);
    }

    // Login user dan generate token
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $result = $this->authService->login($credentials);

        if (!$result) {
            return $this->unauthorizedResponse('Invalid email or password');
        }

        return $this->successResponse($result, 'Login successful');
    }

    // Ambil data user yang sedang login
    public function me()
    {
        $user = auth()->user();

        return $this->successResponse(['user' => $user->toArray()]);
    }

    // Logout dan invalidate token
    public function logout()
    {
        $this->authService->logout();

        return $this->successResponse(null, 'Successfully logged out');
    }
}

