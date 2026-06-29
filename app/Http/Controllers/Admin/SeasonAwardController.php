<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeasonAward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SeasonAwardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SeasonAwards/Index', [
            'seasons' => SeasonAward::query()->orderByDesc('year')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateSeason($request);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image_path'] = $request->file('cover_image')->store('season-awards', 'public');
        }

        SeasonAward::create($validated);

        return Redirect::route('admin.season-awards.index')->with('success', 'Award season imeongezwa kikamilifu.');
    }

    public function update(Request $request, SeasonAward $seasonAward)
    {
        $validated = $this->validateSeason($request, $seasonAward->id);

        if ($request->hasFile('cover_image')) {
            if ($seasonAward->cover_image_path && ! str_starts_with($seasonAward->cover_image_path, 'images/')) {
                Storage::disk('public')->delete($seasonAward->cover_image_path);
            }

            $validated['cover_image_path'] = $request->file('cover_image')->store('season-awards', 'public');
        } else {
            unset($validated['cover_image_path']);
        }

        $seasonAward->update($validated);

        return Redirect::route('admin.season-awards.index')->with('success', 'Award season imeboreshwa kikamilifu.');
    }

    public function destroy(SeasonAward $seasonAward)
    {
        if ($seasonAward->cover_image_path && ! str_starts_with($seasonAward->cover_image_path, 'images/')) {
            Storage::disk('public')->delete($seasonAward->cover_image_path);
        }

        $seasonAward->delete();

        return Redirect::route('admin.season-awards.index')->with('success', 'Award season imefutwa.');
    }

    private function validateSeason(Request $request, ?int $ignoreId = null): array
    {
        $uniqueRule = 'unique:season_awards,year';
        if ($ignoreId) {
            $uniqueRule .= ',' . $ignoreId;
        }

        return $request->validate([
            'year' => 'required|integer|min:2000|max:2100|' . $uniqueRule,
            'theme' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'event_date' => 'nullable|date',
            'event_location_name' => 'nullable|string|max:255',
            'event_location_address' => 'nullable|string|max:1000',
            'event_location_map_url' => 'nullable|url|max:255',
            'cover_image' => 'nullable|image|max:4096',
        ]);
    }
}
