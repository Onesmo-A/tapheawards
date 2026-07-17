<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Setting;
use App\Services\Voting\VoteSessionService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Eloquent\Builder;

// NOTE: This controller uses $searchPhrase in both the query builder and
// in-memory filtering. Ensure it's always defined to avoid 500 errors during
// search.


class CategoryController extends Controller
{
    /**
     * Onyesha kategoria maalum na washiriki wake.
     */
    public function show(Category $category, Request $request, VoteSessionService $voteSessionService): Response
    {
        $category->load(['nominees' => function ($query) {
            $query->where('is_suspended', false)->orderBy('name');
        }]);

        $settings = Cache::remember('app_settings', 3600, function () {
            return Setting::all()->pluck('value', 'key');
        });

        $voteSessions = [];
        foreach ($category->nominees as $nominee) {
            $voteSessions[$nominee->id] = $voteSessionService->issue($nominee, $request);
        }

        return Inertia::render('Categories/Show', [
            'category' => new CategoryResource($category),
            'settings' => [
                'voting_active' => (bool) ($settings->get('voting_active', true)),
                'voting_deadline' => $settings->get('voting_deadline') ?? null,
            ],
            'voteSessions' => $voteSessions,
        ]);
    }


    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $searchTerms = collect(preg_split('/\s+/', mb_strtolower($search), -1, PREG_SPLIT_NO_EMPTY))
            ->filter()
            ->unique()
            ->values();

        $categoryGroups = CategoryGroup::query()
            ->where('status', 'active')
            ->with(['categories' => function ($query) use ($searchTerms) {
                $query->where('status', 'active')
                      ->withCount(['nominees' => function ($nomineeQuery) {
                          $nomineeQuery->where('is_suspended', false);
                      }])
                      ->when($searchTerms->isNotEmpty(), function ($childQuery) {
                          $childQuery->with(['nominees' => function ($nomineeQuery) {
                              $nomineeQuery->where('is_suspended', false)->select('id', 'category_id', 'name', 'bio');
                          }]);
                      })
                      ->orderBy('name', 'asc');
            }])
            ->whereHas('categories', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'groups'   => CategoryGroup::where('status', 'active')->count(),
            'awards'   => Category::where('status', 'active')->count(),
            'nominees' => Category::where('status', 'active')
                ->withCount('nominees')
                ->get()
                ->sum('nominees_count'),
        ];

        return Inertia::render('Categories/Index', [
            'categoryGroups' => CategoryResource::collection($categoryGroups),
            'filters'        => $request->only(['search']),
            'stats'          => $stats,
        ]);
    }
}
