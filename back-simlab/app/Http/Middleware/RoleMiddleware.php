<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        $roles = explode('|', $role);
        foreach ($roles as $key => $role) {
            if (auth()->user()->role == $role) {
                return $next($request);
            }
        }

        return response()->json(['code' => 403, 'success' => false, 'message' => 'Forbiden'], 403);
    }
}
