<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                // Hapa tunatuma object ya 'user' ndani ya 'auth' kama inavyotegemewa na Vue component
                'user' => $request->user() ? $request->user()->only('id', 'name', 'email', 'is_admin') : null,
                // Pata ombi la mtumiaji ambalo bado liko kwenye mchakato (muhimu kwa ajili ya kuonyesha ujumbe kwenye dashboard)
                'pendingApplication' => fn () => $request->user()
                    ? $request->user()->nomineeApplications()
                        ->whereIn('status', ['pending_payment', 'payment_failed', 'pending_review'])
                        ->latest()->first()
                    : null,
                // Kipeperushi cha haraka kuangalia kama kuna maombi yanayosubiri.
                // Hii ni bora kwa performance kuliko kupakia object nzima kila wakati.
                'hasPendingApplication' => fn () => $request->user()
                    ? $request->user()->nomineeApplications()->whereIn('status', ['pending_payment', 'payment_failed', 'pending_review'])->exists()
                    : false,
            ],

            'appName' => config('app.name'),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ];
    }
}
