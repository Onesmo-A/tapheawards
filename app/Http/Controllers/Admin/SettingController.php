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