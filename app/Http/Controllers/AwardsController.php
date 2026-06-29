<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\NomineeResultResource;
use App\Http\Resources\WinnerResource;
use App\Models\SeasonAward;
use App\Models\Category;
use App\Models\Winner;
use App\Models\Nominee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AwardsController extends Controller
{
    public function index(Request $request)
    {
        $settings = Cache::remember('app_settings', 3600, function () {
            return \App\Models\Setting::all()->pluck('value', 'key');
        });

        // Pata 'award seasons' zote, panga kwa mwaka (mpya juu)
        $awardSeasons = SeasonAward::orderBy('year', 'desc')->get();

        $showWinners = (bool) $settings->get('show_winners', false);
        $search = $request->input('search');

        $viewData = [
            'title' => 'Awards Winners',
            'description' => 'Celebrating the winners of the Taphe Awards across different years.',
            // BORESHO: Ongeza 'awardSeasons' kwenye data inayotumwa kwenye view
            'awardSeasons' => $awardSeasons,
            'showWinners' => $showWinners,
            'filters' => $request->only(['search']),
            'winnersByYear' => null,
            'searchedWinners' => null,
        ];

        if (!$showWinners) {
            return Inertia::render('Awards/Index', $viewData);
        }

        if ($search) {
            // Logiki ya utafutaji na pagination
            $winners = Winner::with(['category', 'nominee'])
                ->has('nominee')
                ->where(function ($query) use ($search) {
                    $query->whereHas('nominee', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                })
                ->orderBy('year', 'desc')
                ->paginate(12)
                ->withQueryString();

            $viewData['searchedWinners'] = WinnerResource::collection($winners);
            $viewData['title'] = "Search Results for '{$search}'";
        } else {
            // Logiki ya kawaida ya kuonyesha washindi kwa mwaka
            $winners = Winner::with(['category', 'nominee'])
                ->has('nominee')
                ->orderBy('year', 'desc')
                ->orderBy('category_id', 'asc')
                ->get();

            $winnersArray = WinnerResource::collection($winners)->resolve();
            $viewData['winnersByYear'] = collect($winnersArray)->groupBy('year');
        }

        return Inertia::render('Awards/Index', $viewData);
    }

    public function winners()
    {
        $winners = Winner::with(['nominee.category'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Awards/Winners', [
            'winners' => WinnerResource::collection($winners),
            'pageInfo' => [
                'title' => 'Award Winners',
                'description' => 'Meet our distinguished award winners'
            ]
        ]);
    }

    public function archives()
    {
        $seasons = SeasonAward::orderByDesc('year')->get();

        return Inertia::render('Awards/Archives', [
            'title' => 'Award Archives',
            'description' => 'Browse previous award seasons and winners.',
            'seasons' => $seasons,
        ]);
    }

    public function showSeason(SeasonAward $seasonAward)
    {
        $winners = Winner::with(['category', 'nominee'])
            ->where('year', $seasonAward->year)
            ->get()
            ->keyBy('category_id');

        $categories = Category::query()
            ->whereIn('id', $winners->keys())
            ->orderBy('name')
            ->get()
            ->map(function (Category $category) use ($winners) {
                $winner = $winners->get($category->id);

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'winner' => $winner ? [
                        'id' => $winner->nominee->id,
                        'name' => $winner->nominee->name,
                        'company' => $winner->nominee->bio,
                        'quote' => $winner->description,
                        'image_url' => $winner->nominee->image_url,
                    ] : null,
                ];
            })
            ->values();

        return Inertia::render('Awards/SeasonShow', [
            'season' => [
                'id' => $seasonAward->id,
                'name' => (string) $seasonAward->year,
                'year' => $seasonAward->year,
                'theme' => $seasonAward->theme,
                'description' => $seasonAward->description,
                'cover_image_url' => $seasonAward->cover_image_url,
                'event_date' => $seasonAward->event_date,
                'event_location_name' => $seasonAward->event_location_name,
                'event_location_address' => $seasonAward->event_location_address,
                'event_location_map_url' => $seasonAward->event_location_map_url,
                'categories' => $categories,
            ],
        ]);
    }

    public function resultsByCategory(Request $request, $year, Category $category)
    {
        // Pata mipangilio kuangalia kama matokeo yanaweza kuonyeshwa
        $settings = Cache::remember('app_settings', 3600, function () {
            return \App\Models\Setting::all()->pluck('value', 'key');
        });
        $showWinners = (bool) $settings->get('show_winners', false);

        // Kama matokeo hayaruhusiwi, rudisha data tupu na status
        if (!$showWinners) {
            return Inertia::render('Awards/Results', [
                'category' => new CategoryResource($category),
                'nominees' => [],
                'year' => (int) $year,
                'winnerNomineeId' => null,
                'showResults' => false, // Kipeperushi kwa ajili ya frontend
                'title' => "Voting Results for {$category->name} ({$year})",
            ]);
        }

        // Pata washiriki na idadi ya kura, lakini wapange kwa jina kwa muonekano safi wa category
        $nominees = $category->nominees()
            ->withCount('votes') // Hii itaongeza 'votes_count'
            ->orderBy('name')
            ->get();

        $winner = Winner::where('year', $year)
            ->where('category_id', $category->id)
            ->first();

        return Inertia::render('Awards/Results', [
            'category' => new CategoryResource($category),
            // FIX: Tumia ->resolve() kugeuza resource collection kuwa array halisi.
            // Hii ni njia thabiti zaidi ya kuhakikisha data inafika kama array
            // na kuepuka matatizo ya serialization.
            'nominees' => NomineeResultResource::collection($nominees)->resolve(),
            'year' => (int) $year,
            'winnerNomineeId' => $winner ? $winner->nominee_id : null,
            'showResults' => true, // Kipeperushi kwa ajili ya frontend
            'title' => "Voting Results for {$category->name} ({$year})",
        ]);
    }
}
