<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reels = Reel::latest()->paginate(10);
        return Inertia::render('Admin/Reels/Index', ['reels' => $reels]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Reels/Form', ['reel' => null]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:instagram,youtube',
            'content' => 'required|string|url',
            'is_active' => 'required|boolean',
        ]);

        Reel::create($validated);

        return redirect()->route('admin.reels.index')->with('success', 'Reel created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reel $reel)
    {
        return Inertia::render('Admin/Reels/Form', ['reel' => $reel]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reel $reel)
    {
        $validated = $request->validate([
            'type' => 'required|in:instagram,youtube',
            'content' => 'required|string|url',
            'is_active' => 'required|boolean',
        ]);

        $reel->update($validated);

        return redirect()->route('admin.reels.index')->with('success', 'Reel updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reel $reel)
    {
        $reel->delete();

        return redirect()->route('admin.reels.index')->with('success', 'Reel deleted successfully.');
    }
}