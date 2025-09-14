<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Nominee;
use App\Exports\NomineesExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class NomineeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only('search');

        return Inertia::render('Admin/Nominees/Index', [
            'nominees' => Nominee::with('category')->withCount('votes')
                ->when($request->input('search'), function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->latest()->paginate(10)->withQueryString(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Boresho: Pata data ya 'prefill' kutoka kwenye session na uipitishe kama prop.
        // Hii inafanya mtiririko kuwa wazi zaidi.
        return Inertia::render('Admin/Nominees/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'prefill' => session('prefill', []),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'image_path' => 'nullable|string', // Ruhusu image_path iliyopo kutoka kwenye application
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
            'source_application_id' => 'nullable|exists:nominee_applications,id',
        ]);

        $imagePath = $validated['image_path'] ?? null;

        if ($request->hasFile('image')) {
            // Hifadhi picha mpya kwenye 'public' disk.
            $imagePath = $request->file('image')->store('nominees', 'public');
        }

        // Rekebisho: Unda Nominee kwa usahihi ukitumia fields zinazotarajiwa na Model.
        Nominee::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'bio' => $validated['bio'],
            'image_path' => $imagePath,
            'facebook_url' => $validated['facebook_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'tiktok_url' => $validated['tiktok_url'] ?? null,
            'source_application_id' => $validated['source_application_id'] ?? null,
        ]);


        return redirect()->route('admin.nominees.index')
            ->with('success', 'Nominee created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nominee $nominee)
    {
        $nominee->load('category');
        return Inertia::render('Admin/Nominees/Edit', [
            'nominee' => $nominee,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nominee $nominee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
        ]);

        $updateData = $validated;

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($nominee->image_path) {
                Storage::disk('public')->delete($nominee->image_path);
            }
            // Hifadhi picha mpya kwenye 'public' disk.
            $updateData['image_path'] = $request->file('image')->store('nominees', 'public');
        }

        $nominee->update($updateData);

        return redirect()->route('admin.nominees.index')
            ->with('success', 'Nominee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nominee $nominee)
    {
        if ($nominee->image_path) {
            Storage::disk('public')->delete($nominee->image_path);
        }
        $nominee->delete();

        return redirect()->route('admin.nominees.index')
            ->with('success', 'Nominee deleted successfully.');
    }

    /**
     * Export nominees data to an Excel file.
     */
    public function export()
    {
        return Excel::download(new NomineesExport, 'Business-Awards-nominees-report.xlsx');
    }
}
