<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends BaseController
{
    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated());

        return $this->sendResponse([], 'Berhasil mendaftar');
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $user = User::with('studyProgram')->find(Auth::id());
            $success['token'] =  $user->createToken('api_token')->plainTextToken;
            $success['user'] =  $user;

            return $this->sendResponse($success, 'Berhasil login');
        }

        return $this->sendError('Unauthorized', ['error'=>'Unauthorized'], 401);
    }

    public function getCurrentUser()
    {
        $user = User::with('studyProgram')->find(auth('sanctum')->id());
        if (!$user) {
            return $this->sendError('Unauthorized', ['error'=>'Unauthorized'], 401);
        }
        return $this->sendResponse($user, "User Retreive Successfully");
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return $this->sendResponse([], 'Berhasil logout');
    }
}
