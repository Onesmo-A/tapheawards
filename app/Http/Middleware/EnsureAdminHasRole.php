<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user instanceof AdminUser || !$user->is_active) {
            return response()->json([
                'message' => 'Access Denied: Administrative privileges required.',
            ], 403);
        }

        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Access Denied: Insufficient administrative role.',
            ], 403);
        }

        return $next($request);
    }
}
