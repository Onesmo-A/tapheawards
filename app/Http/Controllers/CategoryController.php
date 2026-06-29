<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
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
        $searchPhrase = mb_strtolower(preg_replace('/\s+/', ' ', $search));
        $searchTerms = collect(preg_split('/\s+/', mb_strtolower($search), -1, PREG_SPLIT_NO_EMPTY))
            ->filter()
            ->unique()
            ->values();

        // Chagua makundi makuu (yale hayana mzazi)
        $categoryGroups = Category::query()
            ->where('status', 'active') // 1. Onyesha makundi makuu yaliyo 'active' tu
            ->whereNull('parent_id')
            // Pakia tuzo zilizo chini yake (children) na hesabu washiriki kwa kila tuzo
            ->with(['children' => function ($query) use ($searchTerms) {
                $query->where('status', 'active') // 2. Pakia tuzo zilizo 'active' tu
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
            // 3. Hakikisha kundi kuu linaonekana tu kama lina tuzo (children) zilizo 'active'
            ->whereHas('children', function ($query) {
                $query->where('status', 'active');
            })
            // Ongeza uwezo wa kutafuta kwenye makundi makuu na tuzo zake
            ->when($searchTerms->isNotEmpty(), function ($query) use ($searchTerms, $searchPhrase) {
                $query->where(function (Builder $rootQuery) use ($searchTerms, $searchPhrase) {
                    $matchCategory = function (Builder $builder, string $termLike): void {
                        $builder->whereRaw('LOWER(CONCAT_WS(" ", name, slug, COALESCE(description, ""))) LIKE ?', [$termLike])
                            ->orWhereHas('children', function (Builder $childQuery) use ($termLike): void {
                                $childQuery->where('status', 'active')
                                    ->where(function (Builder $nested) use ($termLike): void {
                                        $nested->whereRaw('LOWER(CONCAT_WS(" ", name, slug, COALESCE(description, ""))) LIKE ?', [$termLike])
                                            ->orWhereHas('nominees', function (Builder $nomineeQuery) use ($termLike): void {
                                                $nomineeQuery->where('is_suspended', false)
                                                    ->where(function (Builder $nomineeMatch) use ($termLike): void {
                                                        $nomineeMatch->whereRaw('LOWER(CONCAT_WS(" ", name, COALESCE(bio, ""))) LIKE ?', [$termLike])
                                                            ->orWhereRaw('LOWER(name) LIKE ?', [$termLike])
                                                            ->orWhereRaw('LOWER(COALESCE(bio, "")) LIKE ?', [$termLike]);
                                                    });
                                            });
                                    });
                            });
                    };

                    if (filled($searchPhrase)) {
                        $rootQuery->orWhere(function (Builder $phraseQuery) use ($matchCategory, $searchPhrase): void {
                            $matchCategory($phraseQuery, "%{$searchPhrase}%");
                        });
                    }

                    foreach ($searchTerms as $term) {
                        $termLike = "%{$term}%";

                        $rootQuery->orWhere(function (Builder $termQuery) use ($matchCategory, $termLike): void {
                            $matchCategory($termQuery, $termLike);
                        });
                    }
                });
            })
            ->orderBy('name', 'asc') // Panga makundi makuu kwa herufi
            ->paginate(10) // Weka pagination kwenye makundi makuu
            ->withQueryString();

        if ($searchTerms->isNotEmpty()) {
            $categoryGroups->getCollection()->transform(function (Category $category) use ($searchTerms, $searchPhrase) {
                $matchesHaystack = function (string $haystack) use ($searchTerms, $searchPhrase): bool {
                    if ($searchPhrase !== '' && str_contains($haystack, $searchPhrase)) {
                        return true;
                    }

                    foreach ($searchTerms as $term) {
                        if ($term !== '' && str_contains($haystack, $term)) {
                            return true;
                        }
                    }

                    return false;
                };

                if ($category->relationLoaded('children')) {
                    $filteredChildren = $category->children->filter(function (Category $child) use ($matchesHaystack) {
                        $childHaystack = mb_strtolower(trim(implode(' ', array_filter([
                            $child->name ?? '',
                            $child->slug ?? '',
                            $child->description ?? '',
                        ]))));

                        if ($matchesHaystack($childHaystack)) {
                            return true;
                        }

                        return $child->relationLoaded('nominees') && $child->nominees->contains(function ($nominee) use ($matchesHaystack) {
                            $nomineeHaystack = mb_strtolower(trim(implode(' ', array_filter([
                                $nominee->name ?? '',
                                $nominee->bio ?? '',
                            ]))));

                            return $matchesHaystack($nomineeHaystack);
                        });
                    })->values();

                    $category->setRelation('children', $filteredChildren);
                }

                return $category;
            })->filter(function (Category $category) use ($searchTerms, $searchPhrase) {
                $categoryHaystack = mb_strtolower(trim(implode(' ', array_filter([
                    $category->name ?? '',
                    $category->slug ?? '',
                    $category->description ?? '',
                ]))));

                if ($searchPhrase !== '' && str_contains($categoryHaystack, $searchPhrase)) {
                    return true;
                }

                foreach ($searchTerms as $term) {
                    if ($term !== '' && str_contains($categoryHaystack, $term)) {
                        return true;
                    }
                }

                if ($category->children->isNotEmpty()) {
                    return true;
                }

                return false;
            })->values();
        }

        $stats = [
            'groups' => Category::query()->whereNull('parent_id')->where('status', 'active')->count(),
            'awards' => Category::query()->whereNotNull('parent_id')->where('status', 'active')->count(),
            'nominees' => Category::query()
                ->whereNotNull('parent_id')
                ->where('status', 'active')
                ->withCount('nominees')
                ->get()
                ->sum('nominees_count'),
        ];

        return Inertia::render('Categories/Index', [
            'categoryGroups' => CategoryResource::collection($categoryGroups),
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }
}
