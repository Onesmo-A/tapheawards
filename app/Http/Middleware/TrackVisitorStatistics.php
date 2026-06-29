<?php

namespace App\Http\Middleware;

use App\Models\VisitorStatistic;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitorStatistics
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethod('get')) {
            return $response;
        }

        $path = trim($request->path(), '/');
        $routeName = optional($request->route())->getName();

        if (
            $request->is('admin*')
            || $request->is('api/*')
            || $request->expectsJson()
            || $request->ajax()
            || str_starts_with($path, 'file/storage/')
            || $path === 'up'
        ) {
            return $response;
        }

        $visitorKey = $request->cookie('taphe_visitor_id');

        if (empty($visitorKey)) {
            $visitorKey = (string) Str::uuid();
            Cookie::queue(cookie('taphe_visitor_id', $visitorKey, 60 * 24 * 365 * 2));
        }

        VisitorStatistic::create([
            'visitor_key' => $visitorKey,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
            'path' => $path ?: '/',
            'route_name' => $routeName,
            'referrer' => substr((string) $request->headers->get('referer'), 0, 512),
            'visited_at' => now(),
        ]);

        return $response;
    }
}
