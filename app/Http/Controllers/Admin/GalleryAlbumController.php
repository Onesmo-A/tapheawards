<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GalleryAlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $albums = GalleryAlbum::query()
            ->withCount('posts')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/GalleryAlbums/Index', [
            'albums' => $albums,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/GalleryAlbums/Form', [
            'album' => null, // Hakuna album kwa ajili ya kuunda
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateAlbum($request);

        $album = new GalleryAlbum($validated);
        $album->slug = Str::slug($validated['name']);

        if ($request->hasFile('cover_image')) {
            $album->cover_image = $request->file('cover_image')->store('album_covers', 'public');
        }

        $album->save();

        return redirect()->route('admin.gallery-albums.index')->with('success', 'Album created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GalleryAlbum $galleryAlbum)
    {
        // Ongeza URL kamili ya picha ili ionekane kwenye fomu
        $galleryAlbum->cover_image_url = $galleryAlbum->cover_image ? Storage::url($galleryAlbum->cover_image) : null;

        return Inertia::render('Admin/GalleryAlbums/Form', [
            'album' => $galleryAlbum,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GalleryAlbum $galleryAlbum)
    {
        $validated = $this->validateAlbum($request, $galleryAlbum->id);

        $updateData = $validated;
        $updateData['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('cover_image')) {
            if ($galleryAlbum->cover_image) {
                Storage::disk('public')->delete($galleryAlbum->cover_image);
            }
            $updateData['cover_image'] = $request->file('cover_image')->store('album_covers', 'public');
        }

        // Ikiwa hakuna picha mpya na mtumiaji anataka kuondoa iliyopo
        if ($request->input('remove_cover_image') && $galleryAlbum->cover_image) {
            Storage::disk('public')->delete($galleryAlbum->cover_image);
            $updateData['cover_image'] = null;
        }

        $galleryAlbum->update($updateData);

        return redirect()->route('admin.gallery-albums.index')->with('success', 'Album updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GalleryAlbum $galleryAlbum)
    {
        if ($galleryAlbum->cover_image) {
            Storage::disk('public')->delete($galleryAlbum->cover_image);
        }

        $galleryAlbum->delete();

        return redirect()->route('admin.gallery-albums.index')->with('success', 'Album deleted successfully.');
    }

    private function validateAlbum(Request $request, $albumId = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255|unique:gallery_albums,name,' . $albumId,
            'description' => 'nullable|string|max:1000',
            'cover_image' => 'nullable|image|max:2048', // 2MB Max
            'is_published' => 'required|boolean',
        ]);
    }
}
