<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $galleryItems = Post::query()
            ->where('type', 'gallery')
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(16)
            ->through(fn ($post) => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'featured_image_url' => $post->featured_image ? asset('storage/' . $post->featured_image) : null,
            ]);

        return Inertia::render('Gallery/Index', [
            'title' => 'Photo Gallery',
            'description' => 'Explore photos and videos from our past events and award ceremonies.',
            'galleryItems' => $galleryItems,
        ]);
    }
}
