<?php

namespace App\Http\Controllers;

use App\Models\GalleryAlbum;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
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
            ->withCount(['posts' => function ($query) {
                $query->where('status', 'published');
            }])
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

        // Ongeza URL kamili kwa kila picha kwenye albamu
        $album->posts->each(function ($post) {
            $post->featured_image_url = $post->featured_image ? Storage::url($post->featured_image) : null;
            return $post;
        });

        return Inertia::render('Gallery/Show', compact('album'));
    }
}
