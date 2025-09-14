<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = Post::query()
            ->where('type', 'event')
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

        return Inertia::render('Events/Index', [
            'title' => 'Matukio Yetu',
            'description' => 'Pata taarifa za matukio yajayo na yaliyopita ya TAPHE Awards.',
            'events' => $events,
        ]);
    }
}
