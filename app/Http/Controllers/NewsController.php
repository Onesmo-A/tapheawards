<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display the news page.
     */
    public function index(): Response
    {
        $newsItems = Post::query()
            ->where('type', 'update')
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12)
            ->through(fn ($post) => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'published_at' => $post->published_at,
                'featured_image_url' => $post->featured_image ? asset('storage/' . $post->featured_image) : null,
            ]);

        return Inertia::render('News/Index', [
            'title' => 'Habari na Matukio',
            'newsItems' => $newsItems,
        ]);
    }
}