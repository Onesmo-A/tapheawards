<?php

namespace App\Http\Controllers;

use App\Models\GalleryAlbum;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Display a listing of the gallery albums.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $albums = GalleryAlbum::where('is_published', true)
            ->latest()
            ->paginate(12);

        return Inertia::render('Gallery/Index', [
            'albums' => $albums,
            'title' => 'Matunzio ya Picha',
            'description' => 'Tazama matukio mbalimbali ya TAPHE Awards kupitia picha zilizokusanywa kwenye albamu zetu.',
        ]);
    }

    /**
     * Display the specified gallery album and its photos.
     *
     * @param  \App\Models\GalleryAlbum  $album
     * @return \Inertia\Response
     */
    public function show(GalleryAlbum $album): Response
    {
        $album->load(['posts' => fn ($query) => $query->where('status', 'published')->latest()]);

        return Inertia::render('Gallery/Show', compact('album'));
    }
}
