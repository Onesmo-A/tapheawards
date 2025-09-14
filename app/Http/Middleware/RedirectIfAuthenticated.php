<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();
                // Kagua kama mtumiaji ni admin na mpeleke kwenye dashboard yake
                // BORESHO: Tumia $user->is_admin badala ya Auth::user()->is_admin kwa uhakika zaidi
                if ($user && $user->is_admin) {
                    return redirect()->route('admin.dashboard');
                }
                // Mtumiaji wa kawaida aelekezwe kwenye dashboard yake
                return redirect()->route('dashboard');
            }
        }

        return $next($request);
    }
}
