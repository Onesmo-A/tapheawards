<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Resources\NomineeResource;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Onyesha kategoria maalum na washiriki wake.
     */
public function show(Category $category): Response
{
    // Pakia washiriki wote wa kategoria hii ili wawe sehemu ya 'category' object
    $category->load(['nominees' => function ($query) {
        $query->orderBy('name'); // Panga kwa majina (A-Z)
    }]);

    // Pata mipangilio kutoka kwenye cache kwa utendaji bora
    $settings = Cache::remember('app_settings', 3600, function () {
        return Setting::all()->pluck('value', 'key');
    });

    return Inertia::render('Categories/Show', [
        'category' => new CategoryResource($category),
        'settings' => [
            'voting_active' => (bool) ($settings->get('voting_active', true)),
            'voting_deadline' => $settings->get('voting_deadline') ?? null,
        ],
    ]);
}


    public function index(Request $request): Response
    {
        $search = $request->input('search');

        // Chagua makundi makuu (yale hayana mzazi)
        $categoryGroups = Category::query()
            ->where('status', 'active') // 1. Onyesha makundi makuu yaliyo 'active' tu
            ->whereNull('parent_id')
            // Pakia tuzo zilizo chini yake (children) na hesabu washiriki kwa kila tuzo
            ->with(['children' => function ($query) {
                $query->where('status', 'active') // 2. Pakia tuzo zilizo 'active' tu
                      ->withCount('nominees')
                      ->orderBy('name', 'asc');
            }])
            // 3. Hakikisha kundi kuu linaonekana tu kama lina tuzo (children) zilizo 'active'
            ->whereHas('children', function ($query) {
                $query->where('status', 'active');
            })
            // Ongeza uwezo wa kutafuta kwenye makundi makuu na tuzo zake
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%") // Tafuta kwenye jina la kundi kuu
                        ->orWhereHas('children', function ($childQuery) use ($search) {
                            $childQuery->where('status', 'active') // Tafuta kwenye tuzo zilizo active tu
                                       ->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('name', 'asc') // Panga makundi makuu kwa herufi
            ->paginate(10) // Weka pagination kwenye makundi makuu
            ->withQueryString();

        return Inertia::render('Categories/Index', [
            'categoryGroups' => CategoryResource::collection($categoryGroups),
            'filters' => $request->only(['search']),
        ]);
    }
}
