<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Pata mipangilio yote kutoka database
        $settings = Setting::all()->pluck('value', 'key');

        // Weka mipangilio ya msingi endapo haipo kwenye database
        $defaults = [
            'voting_active' => '1',
            'voting_deadline' => null,
            'show_winners' => '0',
            'marathon_fee' => '35000',
            'nomination_open_title' => 'Nomination Applications Now Open!',
            'nomination_open_dates' => '30 Aug - 3 Nov 2025',
            // BORESHO: Ongeza fields za timeline
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
        // Unganisha defaults na settings zilizopo, zilizopo zitabaki na thamani zake
        $settings = collect($defaults)->merge($settings);

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
            'marathon_fee' => 'required|numeric|min:0',
            'nomination_open_title' => 'nullable|string|max:255',
            'nomination_open_dates' => 'nullable|string|max:255',
            // BORESHO: Ongeza validation kwa fields za timeline
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
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Futa cache ya mipangilio ili mabadiliko yaonekane mara moja
        Cache::forget('app_settings');

        return Redirect::route('admin.settings.index')->with('success', 'Mipangilio imehifadhiwa kikamilifu.');
    }
}