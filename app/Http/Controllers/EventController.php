<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use function App\Helpers\public_storage_url;

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
                'featured_image_url' => $post->featured_image ? public_storage_url($post->featured_image) : null,
            ]);

        return Inertia::render('Events/Index', [
            'title' => 'Matukio Yetu',
            'description' => 'Pata taarifa za matukio yajayo na yaliyopita ya TAPHE Awards.',
            'events' => $events,
        ]);
    }

    public function guestOfHonor(): Response
    {
        return Inertia::render('Event/GuestOfHonor', [
            'guestDetails' => [
                'name' => 'Hon. Dr. Jakaya Mrisho Kikwete',
                'title' => '4th President of the United Republic of Tanzania',
                'image' => '/images/guest-of-honor.jpg',
                'bio' => 'We are deeply honored to have His Excellency Dr. Jakaya Mrisho Kikwete grace our event as the Guest of Honor. His leadership and commitment to national development continue to inspire excellence across Tanzania.',
                'quote' => 'The future of Tanzania lies in the hands of its innovative entrepreneurs and resilient businesses.',
            ],
        ]);
    }

    public function artists(): Response
    {
        return Inertia::render('Event/Artists');
    }
}
