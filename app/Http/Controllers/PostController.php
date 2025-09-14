<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function show(Post $post): Response
    {
        // Hakikisha post iliyochaguliwa imekuwa 'published'
        if ($post->status !== 'published') {
            abort(404);
        }

        // Ongeza URL kamili ya picha
        $post->featured_image_url = $post->featured_image ? asset('storage/' . $post->featured_image) : null;
        if ($post->media_gallery) {
            $post->media_gallery = collect($post->media_gallery)->map(function ($path) {
                return asset('storage/' . $path);
            })->all();
        }

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }
}
