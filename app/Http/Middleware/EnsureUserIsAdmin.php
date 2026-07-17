<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AdminUser;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !($user instanceof AdminUser) || !$user->is_active) {
            return response()->json([
                'message' => 'Access Denied: Administrative privileges required.'
            ], 403);
        }

        return $next($request);
    }
}