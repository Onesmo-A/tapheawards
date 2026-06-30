<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Nominee;
use App\Models\Post;
use App\Models\Reel;
use App\Models\Setting;
use App\Models\VisitorStatistic;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use function App\Helpers\public_storage_url;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
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
                'featured_image_url' => $post->featured_image ? public_storage_url($post->featured_image) : null,
            ]);

        $settings = Cache::remember('app_settings', 3600, fn () => Setting::all()->pluck('value', 'key'));

        $categories = Category::withCount('nominees')->latest()->get();

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

            $reels = Reel::query()
                ->where('is_active', true)
                ->latest()
                ->take(3)
                ->get();

            $testimonials = $this->getTestimonials();
        } else {
            $reels = collect();
            $testimonials = collect();
        }

        return Inertia::render('Welcome', [
            'title' => 'Home',
            'description' => 'Celebrating excellence, innovation, and integrity in Tanzania healthcare sector.',
            'categories' => CategoryResource::collection($categories),
            'settings' => [
                'voting_active' => (bool) $settings->get('voting_active', true),
                'voting_deadline' => $settings->get('voting_deadline'),
                'show_visitor_statistics' => (bool) $settings->get('show_visitor_statistics', true),
                'nomination_open_title' => $settings->get('nomination_open_title', 'Nomination Is Now Open'),
                'nomination_open_dates' => $settings->get('nomination_open_dates', '15th July - 30th August 2024'),
                'timeline' => [
                    ['title' => $settings->get('timeline_step1_title', 'Public Suggestions'), 'date' => $settings->get('timeline_step1_date', 'Aug 30 - Sep 15')],
                    ['title' => $settings->get('timeline_step2_title', 'Nominee Applications'), 'date' => $settings->get('timeline_step2_date', 'Sep 16 - Oct 10')],
                    ['title' => $settings->get('timeline_step3_title', 'Marathon & Health Expo'), 'date' => $settings->get('timeline_step3_date', 'Oct 25')],
                    ['title' => $settings->get('timeline_step4_title', 'Awards Gala Night'), 'date' => $settings->get('timeline_step4_date', 'Nov 03')],
                    ['title' => $settings->get('timeline_step5_title', 'Winners Announcement'), 'date' => $settings->get('timeline_step5_date', 'Nov 10')],
                ],
            ],
            'updates' => $updates,
            'heroSlides' => $this->buildHeroSlides($settings),
            'reels' => $reels,
            'testimonials' => $testimonials,
            'visitorStatistics' => $this->buildVisitorStatistics(),
        ]);
    }

    private function buildHeroSlides($settings): array
    {
        $heroBanners = Schema::hasTable('hero_banners')
            ? HeroBanner::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
            : collect();

        if ($heroBanners->isNotEmpty()) {
            return $heroBanners->values()->map(function (HeroBanner $banner, int $index) {
                $buttons = array_values(array_filter([
                    $banner->primary_button_text && $banner->primary_button_url ? [
                        'text' => $banner->primary_button_text,
                        'link' => $banner->primary_button_url,
                        'primary' => true,
                    ] : null,
                    $banner->secondary_button_text && $banner->secondary_button_url ? [
                        'text' => $banner->secondary_button_text,
                        'link' => $banner->secondary_button_url,
                        'primary' => false,
                    ] : null,
                ]));

                return [
                    'eyebrow' => $banner->eyebrow,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'imageUrl' => $banner->image_url,
                    'buttons' => $buttons,
                    'badge' => $banner->badge ?: 'Slide ' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                ];
            })->all();
        }

        return $this->buildLegacyHeroSlides($settings);
    }

    private function buildLegacyHeroSlides($settings): array
    {
        $slides = [
            [
                'title' => "Tanzania People's Health Excellence Awards",
                'description' => 'Honoring outstanding healthcare providers, hospitals, and institutions across Tanzania.',
                'image_key' => 'hero_slide_1_image',
                'fallback' => 'images/hero/slide-1.png',
                'buttons' => [
                    ['text' => 'Vote Now', 'link' => '/categories', 'primary' => true],
                    ['text' => 'View Winners', 'link' => '/awards', 'primary' => false],
                ],
            ],
            [
                'title' => 'Vote for Your Health Heroes',
                'description' => 'Support doctors, nurses, and healthcare facilities making a difference in our communities.',
                'image_key' => 'hero_slide_2_image',
                'fallback' => 'images/hero/slide-2.png',
                'buttons' => [
                    ['text' => 'Cast Your Vote', 'link' => '/categories', 'primary' => true],
                    ['text' => 'See Nominees', 'link' => '/awards', 'primary' => false],
                ],
            ],
            [
                'title' => 'Innovation, Positive Impact, Integrity',
                'description' => 'Recognizing innovation, positive impact, and integrity in healthcare leadership and service delivery.',
                'image_key' => 'hero_slide_3_image',
                'fallback' => 'images/hero/slide-3.png',
                'buttons' => [
                    ['text' => 'Suggest Nominee', 'link' => '/suggest-nominee', 'primary' => true],
                    ['text' => 'More About TAPHE', 'link' => '/about', 'primary' => false],
                ],
            ],
            [
                'title' => 'Join the Celebration',
                'description' => 'Be part of the national awards event celebrating Tanzania healthcare champions.',
                'image_key' => 'hero_slide_4_image',
                'fallback' => 'images/hero/slide-4.png',
                'buttons' => [
                    ['text' => 'Register for Marathon', 'link' => '/marathon/register', 'primary' => true],
                    ['text' => 'See Past Winners', 'link' => '/awards', 'primary' => false],
                ],
            ],
        ];

        return array_map(function (array $slide, int $index) use ($settings) {
            return [
                'eyebrow' => null,
                'title' => $slide['title'],
                'description' => $slide['description'],
                'imageUrl' => $this->resolveHeroImageUrl($settings->get($slide['image_key']), $slide['fallback']),
                'buttons' => $slide['buttons'],
                'badge' => 'Slide ' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
            ];
        }, $slides, array_keys($slides));
    }

    private function resolveHeroImageUrl(?string $path, string $fallback): string
    {
        if (empty($path)) {
            return asset($fallback);
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return public_storage_url($path) ?? asset($fallback);
    }

    private function buildVisitorStatistics(): array
    {
        $query = VisitorStatistic::query();
        $onlineSince = now()->subMinutes(5);

        return [
            'total_visitors' => (clone $query)->distinct('visitor_key')->count('visitor_key'),
            'today_visitors' => (clone $query)->whereDate('visited_at', today())->distinct('visitor_key')->count('visitor_key'),
            'week_visitors' => (clone $query)->whereBetween('visited_at', [now()->startOfWeek(), now()->endOfWeek()])->distinct('visitor_key')->count('visitor_key'),
            'month_visitors' => (clone $query)->whereMonth('visited_at', now()->month)->whereYear('visited_at', now()->year)->distinct('visitor_key')->count('visitor_key'),
            'online_visitors' => (clone $query)->where('visited_at', '>=', $onlineSince)->distinct('visitor_key')->count('visitor_key'),
            'page_views' => VisitorStatistic::count(),
        ];
    }

    private function getTestimonials()
    {
        return [
            [
                'id' => 1,
                'body' => 'We are honored to welcome patients from across Africa who choose our hospitals for medical treatments and surgeries.',
                'author' => [
                    'name' => 'Hon. Saad Mtambule',
                    'role' => 'District Commissioner, Kinondoni District',
                    'imageUrl' => '/images/testimonials/saad-mtambule.jpg',
                ],
            ],
            [
                'id' => 2,
                'body' => 'Participating in the TAPHE Awards offers more than a trophy. It brings recognition and visibility.',
                'author' => [
                    'name' => 'Mr. Karim S. Haji',
                    'role' => 'Director - WICoL',
                    'imageUrl' => '/images/testimonials/karim-haji.jpg',
                ],
            ],
        ];
    }

    /**
     * Expose welcome data as JSON for the React SPA.
     */
    public function getApiData(): \Illuminate\Http\JsonResponse
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
                'featured_image_url' => $post->featured_image ? public_storage_url($post->featured_image) : null,
            ]);

        $settings = Cache::remember('app_settings', 3600, fn () => Setting::all()->pluck('value', 'key'));

        $categories = Category::with(['nominees' => function($query) {
            $query->where('is_suspended', false);
        }])->withCount('nominees')->latest()->get();

        $reels = Reel::query()
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get();

        $testimonials = $this->getTestimonials();

        return response()->json([
            'status' => 'success',
            'title' => 'Home',
            'description' => 'Celebrating excellence, innovation, and integrity in Tanzania healthcare sector.',
            'categories' => CategoryResource::collection($categories),
            'settings' => [
                'voting_active' => (bool) $settings->get('voting_active', true),
                'voting_deadline' => $settings->get('voting_deadline'),
                'show_visitor_statistics' => (bool) $settings->get('show_visitor_statistics', true),
                'nomination_open_title' => $settings->get('nomination_open_title', 'Nomination Is Now Open'),
                'nomination_open_dates' => $settings->get('nomination_open_dates', '15th July - 30th August 2024'),
                'timeline' => [
                    ['title' => $settings->get('timeline_step1_title', 'Public Suggestions'), 'date' => $settings->get('timeline_step1_date', 'Aug 30 - Sep 15')],
                    ['title' => $settings->get('timeline_step2_title', 'Nominee Applications'), 'date' => $settings->get('timeline_step2_date', 'Sep 16 - Oct 10')],
                    ['title' => $settings->get('timeline_step3_title', 'Marathon & Health Expo'), 'date' => $settings->get('timeline_step3_date', 'Oct 25')],
                    ['title' => $settings->get('timeline_step4_title', 'Awards Gala Night'), 'date' => $settings->get('timeline_step4_date', 'Nov 03')],
                    ['title' => $settings->get('timeline_step5_title', 'Winners Announcement'), 'date' => $settings->get('timeline_step5_date', 'Nov 10')],
                ],
            ],
            'updates' => $updates,
            'heroSlides' => $this->buildHeroSlides($settings),
            'reels' => $reels,
            'testimonials' => $testimonials,
            'visitorStatistics' => $this->buildVisitorStatistics(),
        ]);
    }
}
