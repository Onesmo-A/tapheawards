<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SponsorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sponsors/Index', [
            'sponsors' => Sponsor::query()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateSponsor($request);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('sponsors', 'public');
        }

        Sponsor::create($validated);

        return Redirect::route('admin.sponsors.index')->with('success', 'Sponsor imeongezwa kikamilifu.');
    }

    public function update(Request $request, Sponsor $sponsor)
    {
        $validated = $this->validateSponsor($request);

        if ($request->hasFile('logo')) {
            if ($sponsor->logo_path && ! str_starts_with($sponsor->logo_path, 'images/')) {
                Storage::disk('public')->delete($sponsor->logo_path);
            }

            $validated['logo_path'] = $request->file('logo')->store('sponsors', 'public');
        } else {
            unset($validated['logo_path']);
        }

        $sponsor->update($validated);

        return Redirect::route('admin.sponsors.index')->with('success', 'Sponsor imeboreshwa kikamilifu.');
    }

    public function destroy(Sponsor $sponsor)
    {
        if ($sponsor->logo_path && ! str_starts_with($sponsor->logo_path, 'images/')) {
            Storage::disk('public')->delete($sponsor->logo_path);
        }

        $sponsor->delete();

        return Redirect::route('admin.sponsors.index')->with('success', 'Sponsor imefutwa.');
    }

    private function validateSponsor(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'tier' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|image|max:4096',
            'website_url' => 'nullable|url|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'required|integer|min:0',
        ]);
    }
}
