<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use App\Models\Category;
use App\Models\Nominee;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the homepage.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        // Pata mipangilio ya upigaji kura kutoka kwenye database
        // Tunatumia Cache ili kupunguza maswali kwenda kwenye database kila mara ukurasa unapofunguliwa
        $settings = Cache::remember('app_settings', 3600, function () {
            return Setting::all()->pluck('value', 'key');
        });

        // 1. Pata kategoria zote na idadi ya washiriki.
        $categories = Category::withCount('nominees')->latest()->get();

        // 2. Ikiwa kuna kategoria, pata washiriki 4 wa juu kwa kila kategoria.
        // Hii njia mpya haitumii "ROW_NUMBER()" na itafanya kazi kwenye MySQL toleo la zamani.
        if ($categories->isNotEmpty()) {
            $categoryIds = $categories->pluck('id')->all();

            // Pata washiriki wote kutoka kategoria zote zinazoonyeshwa, panga kwa wapya zaidi.
            $allNominees = Nominee::whereIn('category_id', $categoryIds)
                ->latest('created_at') // Panga kwa wapya zaidi
                ->get();

            // Weka washiriki kwenye makundi kulingana na 'category_id'
            $nomineesByCategory = $allNominees->groupBy('category_id');

            // 3. Sasa, ambatanisha washiriki 4 wa juu kwa kila kategoria
            $categories->each(function ($category) use ($nomineesByCategory) {
                // Pata washiriki wa kategoria hii, au collection tupu kama hakuna
                $categoryNominees = $nomineesByCategory->get($category->id, collect());

                // Chukua washiriki 4 wa mwanzo na uwaweke kwenye kategoria
                // Inertia itaita `image_url` accessor kiotomatiki.
                $category->setRelation('nominees', $categoryNominees->take(4));
            });
        }

       return Inertia::render('Welcome', [
    'title' => 'Home',
    'description' => 'Celebrating Excellence, Innovation, and Leadership in the Business Community.',
    'categories' => CategoryResource::collection($categories),
    'settings' => $settings, // Pitisha mipangilio kwenye ukurasa wa mbele

    // NEW: Hero slides (title + description tofauti)
    'heroSlides' => [
        [
            'title' => "Tanzania People's Healthy Excellence Awards",
            'description' => 'Celebrating Excellence, Innovation, and Leadership in the Business Community.',
            'buttons' => [
                [ 'text' => 'VOTE NOW →', 'link' => '/categories', 'primary' => true ],
                [ 'text' => 'All Award Winners →', 'link' => '/awards', 'primary' => false ],
            ],
        ],
        [
            'title' => 'Vote for Your Health Heroes',
            'description' => 'Chagua watoa huduma bora wa afya wanaoleta mabadiliko kwenye jamii.',
            'buttons' => [
                [ 'text' => 'VOTE FOR HEALTH', 'link' => '/categories?health=1', 'primary' => true ],
                [ 'text' => 'View Health Nominees', 'link' => '/awards?health=1', 'primary' => false ],
            ],
        ],
        [
            'title' => 'Innovation • Impact • Integrity',
            'description' => 'Tunatambua ubunifu, athari chanya na uadilifu katika uongozi wa biashara.',
            'buttons' => [
                [ 'text' => 'See Innovations', 'link' => '/categories?type=innovation', 'primary' => true ],
                [ 'text' => 'Award Criteria', 'link' => '/criteria', 'primary' => false ],
            ],
        ],
        [
            'title' => 'Join the Celebration',
            'description' => 'Hudhuria hafla ya utoaji tuzo na uunge mkono waleta mabadiliko.',
            'buttons' => [
                [ 'text' => 'RSVP Event', 'link' => '/event', 'primary' => true ],
                [ 'text' => 'Past Winners', 'link' => '/awards', 'primary' => false ],
            ],
        ],
    ],
]);

    }
}