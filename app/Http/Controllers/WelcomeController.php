<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use App\Models\Category;
use App\Models\Post;
use App\Models\Nominee;
use App\Models\Reel;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the homepage.
     */
    public function index(): Response
    {
         $updates = Post::query()
            ->where('type', 'update')
            ->where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn ($post) => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'featured_image_url' => $post->featured_image ? asset('storage/' . $post->featured_image) : null,
            ]);
        // Load settings with cache
        $settings = Cache::remember('app_settings', 3600, function () {
            return Setting::all()->pluck('value', 'key');
        });

        // Load categories with nominee count
        $categories = Category::withCount('nominees')->latest()->get();
       
        // Load top 4 nominees per category
        if ($categories->isNotEmpty()) {
            $categoryIds = $categories->pluck('id')->all();

            $allNominees = Nominee::whereIn('category_id', $categoryIds)
                ->latest('created_at')
                ->get();

            $nomineesByCategory = $allNominees->groupBy('category_id');

            $categories->each(function ($category) use ($nomineesByCategory) {
                $categoryNominees = $nomineesByCategory->get($category->id, collect());
                $category->setRelation('nominees', $categoryNominees->take(4));
            });

        // NEW: Pata reels zilizochapishwa
        $reels = Reel::query()
            ->where('is_active', true)
            ->latest()
            ->take(3) // Unaweza kubadilisha idadi
            ->get();

            // BORESHO: Ongeza data ya testimonials
            $testimonials = $this->getTestimonials();
        } else {
            $reels = collect();
            $testimonials = collect();
        }

        return Inertia::render('Welcome', [
            'title' => 'Home',
            'description' => 'Celebrating excellence, innovation, and integrity in Tanzania’s healthcare sector.',
            'categories' => CategoryResource::collection($categories),
            // BORESHO: Tuma mipangilio muhimu tu na hakikisha inakuwa na cast sahihi
            'settings' => [
                'voting_active' => (bool) $settings->get('voting_active', true),
                'voting_deadline' => $settings->get('voting_deadline'),
                // Ongeza mipangilio ya nomination section
                'nomination_open_title' => $settings->get('nomination_open_title', 'Nomination Is Now Open'),
                'nomination_open_dates' => $settings->get('nomination_open_dates', '15th July - 30th August 2024'),
                // BORESHO: Ongeza data ya timeline
                'timeline' => [
                    ['title' => $settings->get('timeline_step1_title', 'Public Suggestions'), 'date' => $settings->get('timeline_step1_date', 'Aug 30 - Sep 15')],
                    ['title' => $settings->get('timeline_step2_title', 'Nominee Applications'), 'date' => $settings->get('timeline_step2_date', 'Sep 16 - Oct 10')],
                    ['title' => $settings->get('timeline_step3_title', 'Marathon & Health Expo'), 'date' => $settings->get('timeline_step3_date', 'Oct 25')],
                    ['title' => $settings->get('timeline_step4_title', 'Awards Gala Night'), 'date' => $settings->get('timeline_step4_date', 'Nov 03')],
                    ['title' => $settings->get('timeline_step5_title', 'Winners Announcement'), 'date' => $settings->get('timeline_step5_date', 'Nov 10')],
                ]
            ], 'updates' => $updates,

            // Hero slides for TAPHE Awards
            'heroSlides' => [
                [
                    'title' => "Tanzania People's Health Excellence Awards (TAPHE)",
                    'description' => 'Honoring outstanding healthcare providers, hospitals, and institutions across Tanzania.',
                    'buttons' => [
                        [ 'text' => 'VOTE NOW →', 'link' => '/categories', 'primary' => true ],
                        [ 'text' => 'View All Winners →', 'link' => '/awards', 'primary' => false ],
                    ],
                ],
                [
                    'title' => 'Vote for Your Health Heroes',
                    'description' => 'Support doctors, nurses, and healthcare facilities making a difference in our communities.',
                    'buttons' => [
                        [ 'text' => 'CAST YOUR VOTE', 'link' => '/categories', 'primary' => true ],
                        [ 'text' => 'See Nominees', 'link' => '/awards', 'primary' => false ],
                    ],
                ],
                [
                    'title' => 'Innovation, Postive Impact, Integrity',
                    'description' => 'Recognizing innovation, positive impact, and integrity in healthcare leadership and service delivery.',
                    'buttons' => [
                        [ 'text' => 'Suggesstion Nominee', 'link' => '/suggest-nominee', 'primary' => true ],
                        [ 'text' => 'More About TAPHE', 'link' => '/about', 'primary' => false ],
                    ],
                ],
                [
                    'title' => 'Join the Celebration',
                    'description' => 'Be part of the national awards event celebrating Tanzania’s healthcare champions.',
                    'buttons' => [
                        [ 'text' => 'Register for Marathon', 'link' => '/marathon/register', 'primary' => true ],
                        [ 'text' => 'See Past Winners', 'link' => '/awards', 'primary' => false ],
                    ],
                ],
            ],
            'reels' => $reels, // NEW: Tuma reels kwenye view
            'testimonials' => $testimonials, // BORESHO: Tuma testimonials kwenye view
        ]);
    }

    /**
     * BORESHO: Njia ya kupata data ya testimonials.
     * Hii inaweza kuhamishiwa kwenye model au service baadaye.
     */
    private function getTestimonials()
    {
        return [
            [
                'id' => 1,
                'body' => 'We are honored to welcome patients from across Africa who choose our hospitals for medical treatments and surgeries, a remarkable achievement in this sector.',
                'author' => [
                    'name' => 'Hon. Saad Mtambule',
                    'role' => 'District Commissioner, Kinondoni District',
                    'imageUrl' => '/images/testimonials/saad-mtambule.jpg', // Badilisha na picha halisi
                ],
            ],
            [
                'id' => 2,
                'body' => 'Participating in the Tanzania People’s Health Excellence (TAPHE) Awards offers more than just the chance to win trophies, it provides hospitals and individual professionals with significant public recognition and visibility.',
                'author' => [
                    'name' => 'Mr. Karim S. Haji',
                    'role' => 'Director - WICoL',
                    'imageUrl' => '/images/testimonials/karim-haji.jpg', // Badilisha na picha halisi
                ],
            ],
        ];
    }
}
