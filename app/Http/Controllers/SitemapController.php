<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Setting;
use App\Models\Winner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index()
    {
        $urls = [];

        // 1. Ongeza kurasa za kawaida (static pages)
        // Tunatumia majina ya routes ili kuepuka ku-hardcode URLs
        $staticRoutes = [
            'home', 'about', 'categories.index', 'awards.index', 'awards.winners',
            'participate', 'sponsors.index', 'contact.show', 'news.index',
            'gallery.index', 'tickets.index', 'event.guest-of-honor',
            'event.artists', 'nominees.suggest'
        ];

        foreach ($staticRoutes as $routeName) {
            $urls[] = [
                'loc' => route($routeName),
                'lastmod' => Carbon::now()->toDateString(),
                'priority' => ($routeName === 'home' || $routeName === 'categories.index') ? '1.0' : '0.8',
                'changefreq' => ($routeName === 'home' || $routeName === 'categories.index') ? 'daily' : 'weekly',
            ];
        }

        // 2. Ongeza kurasa za kategoria (dynamic pages)
        // Tunachukua tuzo (children categories) ambazo ziko 'active'
        $categories = Category::where('status', 'active')->whereNotNull('parent_id')->get();
        foreach ($categories as $category) {
            $urls[] = [
                'loc' => route('categories.show', $category->slug),
                'lastmod' => $category->updated_at->toDateString(),
                'priority' => '0.9',
                'changefreq' => 'weekly',
            ];
        }

        // 3. Ongeza kurasa za matokeo ya washindi (dynamic pages)
        // Kwanza, kagua kama setting ya kuonyesha washindi imewashwa
        $settings = Cache::remember('app_settings', 3600, function () {
            return Setting::all()->pluck('value', 'key');
        });
        $showWinners = (bool) $settings->get('show_winners', false);

        if ($showWinners) {
            // Tunapata mchanganyiko wa kipekee wa mwaka na kategoria kutoka kwa washindi
            $results = Winner::with('category')->select('year', 'category_id')->whereHas('category')->distinct()->get();
            foreach ($results as $result) {
                $urls[] = [
                    'loc' => route('awards.results.category', ['year' => $result->year, 'category' => $result->category->slug]),
                    'lastmod' => Carbon::now()->toDateString(), // Kurasa hizi hazina 'updated_at', tunatumia tarehe ya sasa
                    'priority' => '0.7',
                    'changefreq' => 'yearly',
                ];
            }
        }

        // Tumia view ya 'sitemap.blade.php' tuliyotengeneza
        return response()->view('sitemap', ['urls' => $urls])->header('Content-Type', 'text/xml');
    }
}
