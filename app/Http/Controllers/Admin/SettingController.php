<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeasonAward;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use function App\Helpers\public_storage_url;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        $defaults = [
            'voting_active' => '1',
            'voting_deadline' => null,
            'show_winners' => '0',
            'show_visitor_statistics' => '1',
            'marathon_fee' => '35000',
            'active_season_year' => SeasonAward::query()->orderByDesc('year')->value('year') ?? now()->year,
            'event_location_name' => 'TBA Event Venue',
            'event_location_address' => 'Venue details will be announced soon.',
            'event_location_map_url' => null,
            'nomination_open_title' => 'Nomination Applications Now Open!',
            'nomination_open_dates' => '30 Aug - 3 Nov 2025',
            'timeline_step1_title' => 'Public Suggestions',
            'timeline_step1_date' => 'Aug 30 - Sep 15',
            'timeline_step2_title' => 'Nominee Applications',
            'timeline_step2_date' => 'Sep 16 - Oct 10',
            'timeline_step3_title' => 'Marathon & Health Expo',
            'timeline_step3_date' => 'Oct 25',
            'timeline_step4_title' => 'Awards Gala Night',
            'timeline_step4_date' => 'Nov 03',
            'timeline_step5_title' => 'Winners Announcement',
            'timeline_step5_date' => 'Nov 10',
        ];

        $settings = collect($defaults)->merge($settings);

        foreach ([1, 2, 3, 4] as $index) {
            $key = "hero_slide_{$index}_image";
            $settings->put("{$key}_url", $this->resolveHeroImageUrl($settings->get($key)));
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'voting_active' => 'required|boolean',
            'voting_deadline' => 'nullable|date',
            'show_winners' => 'required|boolean',
            'show_visitor_statistics' => 'required|boolean',
            'marathon_fee' => 'required|numeric|min:0',
            'active_season_year' => 'nullable|integer|min:2000|max:2100',
            'event_location_name' => 'nullable|string|max:255',
            'event_location_address' => 'nullable|string|max:1000',
            'event_location_map_url' => 'nullable|url|max:255',
            'nomination_open_title' => 'nullable|string|max:255',
            'nomination_open_dates' => 'nullable|string|max:255',
            'timeline_step1_title' => 'nullable|string|max:255',
            'timeline_step1_date' => 'nullable|string|max:255',
            'timeline_step2_title' => 'nullable|string|max:255',
            'timeline_step2_date' => 'nullable|string|max:255',
            'timeline_step3_title' => 'nullable|string|max:255',
            'timeline_step3_date' => 'nullable|string|max:255',
            'timeline_step4_title' => 'nullable|string|max:255',
            'timeline_step4_date' => 'nullable|string|max:255',
            'timeline_step5_title' => 'nullable|string|max:255',
            'timeline_step5_date' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        Cache::forget('app_settings');

        return Redirect::route('admin.settings.index')->with('success', 'Mipangilio imehifadhiwa kikamilifu.');
    }

    public function updateSeason(Request $request)
    {
        $validated = $request->validate([
            'active_season_year' => 'required|integer|min:2000|max:2100',
        ]);

        Setting::updateOrCreate(
            ['key' => 'active_season_year'],
            ['value' => $validated['active_season_year']]
        );

        Cache::forget('app_settings');

        return back()->with('success', 'Msimu uliopo sasa umebadilishwa kikamilifu.');
    }

    private function resolveHeroImageUrl(?string $path): string
    {
        if (empty($path)) {
            return asset('images/hero/slide-1.png');
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return public_storage_url($path) ?? asset('images/hero/slide-1.png');
    }
}
