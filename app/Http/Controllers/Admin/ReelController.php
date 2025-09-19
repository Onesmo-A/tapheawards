<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use App\Http\Requests\StoreReelRequest;
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
        return Inertia::render('Admin/Reels/Index', [
            'reels' => $reels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Reels/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReelRequest $request)
    {
        // For now, we are saving the 'content' as a string (URL or embed code).
        // If you decide to handle image uploads, you'll need to add logic here
        // to store the file and save its path.
        Reel::create($request->validated());

        return redirect()->route('admin.reels.index')->with('success', 'Reel/Tangazo limeongezwa kikamilifu.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Reel $reel)
    {
        // Not typically needed for a simple CRUD, but you can implement if you want a detail view.
        return redirect()->route('admin.reels.edit', $reel);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reel $reel)
    {
        return Inertia::render('Admin/Reels/Edit', [
            'reel' => $reel,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreReelRequest $request, Reel $reel)
    {
        // Similar to store, if you handle image uploads, logic will be needed here.
        $reel->update($request->validated());

        return redirect()->route('admin.reels.index')->with('success', 'Reel/Tangazo limehaririwa kikamilifu.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reel $reel)
    {
        // Add logic here to delete the image file from storage if it exists
        // before deleting the database record.
        
        $reel->delete();

        return redirect()->route('admin.reels.index')->with('success', 'Reel/Tangazo limefutwa kikamilifu.');
    }
}