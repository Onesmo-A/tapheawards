<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroBanner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class HeroBannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Content/HeroBanners/Index', [
            'heroBanners' => Schema::hasTable('hero_banners')
                ? HeroBanner::query()
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->get()
                : collect(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateBanner($request);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('hero-banners', 'public');
        }

        HeroBanner::create($validated);

        return Redirect::route('admin.hero-banners.index')->with('success', 'Hero banner imeongezwa kikamilifu.');
    }

    public function update(Request $request, HeroBanner $heroBanner)
    {
        $validated = $this->validateBanner($request);

        if ($request->hasFile('image')) {
            if ($heroBanner->image_path && !str_starts_with($heroBanner->image_path, 'images/')) {
                Storage::disk('public')->delete($heroBanner->image_path);
            }

            $validated['image_path'] = $request->file('image')->store('hero-banners', 'public');
        } else {
            unset($validated['image_path']);
        }

        $heroBanner->update($validated);

        return Redirect::route('admin.hero-banners.index')->with('success', 'Hero banner imeboreshwa kikamilifu.');
    }

    public function destroy(HeroBanner $heroBanner)
    {
        if ($heroBanner->image_path && !str_starts_with($heroBanner->image_path, 'images/')) {
            Storage::disk('public')->delete($heroBanner->image_path);
        }

        $heroBanner->delete();

        return Redirect::route('admin.hero-banners.index')->with('success', 'Hero banner imefutwa.');
    }

    private function validateBanner(Request $request): array
    {
        return $request->validate([
            'eyebrow' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|max:4096',
            'primary_button_text' => 'nullable|string|max:80',
            'primary_button_url' => 'nullable|string|max:255',
            'secondary_button_text' => 'nullable|string|max:80',
            'secondary_button_url' => 'nullable|string|max:255',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);
    }
}
