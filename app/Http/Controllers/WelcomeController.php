<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use App\Models\Category;
use App\Models\Nominee;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the homepage.
     */
    public function index(): Response
    {
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
        }

        return Inertia::render('Welcome', [
            'title' => 'Home',
            'description' => 'Celebrating excellence, innovation, and integrity in Tanzania’s healthcare sector.',
            'categories' => CategoryResource::collection($categories),
            'settings' => $settings,

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
                    'title' => 'Innovation • Impact • Integrity',
                    'description' => 'Recognizing innovation, positive impact, and integrity in healthcare leadership and service delivery.',
                    'buttons' => [
                        [ 'text' => 'Learn About Criteria', 'link' => '/criteria', 'primary' => true ],
                        [ 'text' => 'More About TAPHE', 'link' => '/about', 'primary' => false ],
                    ],
                ],
                [
                    'title' => 'Join the Celebration',
                    'description' => 'Be part of the national awards event celebrating Tanzania’s healthcare champions.',
                    'buttons' => [
                        [ 'text' => 'RSVP for Event', 'link' => '/event', 'primary' => true ],
                        [ 'text' => 'See Past Winners', 'link' => '/awards', 'primary' => false ],
                    ],
                ],
            ],
        ]);
    }
}
