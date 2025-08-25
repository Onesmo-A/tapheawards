<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\NomineeResultResource;
use App\Http\Resources\WinnerResource;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Winner;
use App\Models\Nominee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AwardsController extends Controller
{
    public function index(Request $request)
    {
        $settings = Cache::remember('app_settings', 3600, function () {
            return \App\Models\Setting::all()->pluck('value', 'key');
        });

        $showWinners = (bool) $settings->get('show_winners', false);
        $search = $request->input('search');

        $viewData = [
            'title' => 'Awards Winners',
            'description' => 'Celebrating the winners of the Business Awards across different years.',
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
                ->get()
                ->filter(fn ($winner) => $winner->nominee !== null);

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

        // Pata washiriki na idadi ya kura, panga kwa kura
        $nominees = $category->nominees()
            ->withCount('votes') // Hii itaongeza 'votes_count'
            ->orderByDesc('votes_count')
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
