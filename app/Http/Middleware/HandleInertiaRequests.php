<?php

namespace App\Http\Middleware;

use App\Models\SeasonAward;
use App\Models\Setting;
use App\Models\Sponsor;
use App\Models\VisitorStatistic;
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
        $settings = Setting::query()->pluck('value', 'key');
        $seasons = SeasonAward::query()
            ->orderByDesc('year')
            ->get(['id', 'year', 'theme', 'description', 'event_date', 'cover_image_path']);

        $activeSeasonYear = isset($settings['active_season_year']) && $settings['active_season_year'] !== ''
            ? (int) $settings['active_season_year']
            : $seasons->first()?->year;
        $activeSeason = $activeSeasonYear
            ? $seasons->firstWhere('year', (int) $activeSeasonYear)
            : $seasons->first();

        return [
            ...parent::share($request),

            'auth' => [
                // Hapa tunatuma object ya 'user' ndani ya 'auth' kama inavyotegemewa na Vue component
                'user' => $request->user() ? $request->user()->only('id', 'name', 'email', 'is_admin') : null,
                // Pata ombi la mtumiaji ambalo bado liko kwenye mchakato (muhimu kwa ajili ya kuonyesha ujumbe kwenye dashboard)
                'pendingApplication' => fn () => $request->user()
                    ? $request->user()->nomineeApplications()
                        ->with('category') // IMEONGEZWA: Inapakia taarifa za kategoria kuzuia kosa kwenye dashboard
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

            'awardSeasonContext' => [
                'activeYear' => $activeSeasonYear ? (int) $activeSeasonYear : null,
                'activeSeason' => $activeSeason ? [
                    'id' => $activeSeason->id,
                    'year' => (int) $activeSeason->year,
                    'theme' => $activeSeason->theme,
                    'description' => $activeSeason->description,
                    'event_date' => $activeSeason->event_date,
                    'cover_image_url' => $activeSeason->cover_image_url,
                ] : null,
                'seasons' => $seasons->map(fn (SeasonAward $season) => [
                    'id' => $season->id,
                    'year' => (int) $season->year,
                    'theme' => $season->theme,
                    'description' => $season->description,
                    'event_date' => $season->event_date,
                    'cover_image_url' => $season->cover_image_url,
                ])->values(),
            ],

            'sponsors' => fn () => Sponsor::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Sponsor $sponsor) => [
                    'id' => $sponsor->id,
                    'name' => $sponsor->name,
                    'tier' => $sponsor->tier,
                    'description' => $sponsor->description,
                    'website_url' => $sponsor->website_url,
                    'logo' => $sponsor->logo_url,
                ])->values(),

            'visitorStatistics' => [
                'enabled' => (bool) $settings->get('show_visitor_statistics', true),
                'total_visitors' => VisitorStatistic::query()->distinct('visitor_key')->count('visitor_key'),
                'today_visitors' => VisitorStatistic::query()->whereDate('visited_at', today())->distinct('visitor_key')->count('visitor_key'),
                'week_visitors' => VisitorStatistic::query()->whereBetween('visited_at', [now()->startOfWeek(), now()->endOfWeek()])->distinct('visitor_key')->count('visitor_key'),
                'month_visitors' => VisitorStatistic::query()->whereMonth('visited_at', now()->month)->whereYear('visited_at', now()->year)->distinct('visitor_key')->count('visitor_key'),
                'online_visitors' => VisitorStatistic::query()->where('visited_at', '>=', now()->subMinutes(5))->distinct('visitor_key')->count('visitor_key'),
                'page_views' => VisitorStatistic::query()->count(),
            ],
        ];
    }
}
