<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use function App\Helpers\public_storage_url;

class PostController extends Controller
{
    public function show(Post $post): Response
    {
        // Hakikisha post iliyochaguliwa imekuwa 'published'
        if ($post->status !== 'published') {
            abort(404);
        }

        // Ongeza URL kamili ya picha
        $post->featured_image_url = $post->featured_image ? public_storage_url($post->featured_image) : null;
        if ($post->media_gallery) {
            $post->media_gallery = collect($post->media_gallery)->map(function ($path) {
                return public_storage_url($path) ?? $path;
            })->all();
        }

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }
}
