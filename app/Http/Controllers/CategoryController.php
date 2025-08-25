<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\NomineeResource;
use App\Models\Category;
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
    // Tumeondoa withCount('votes') ili kuzuia uvujaji wa idadi ya kura
    $nominees = $category->nominees()
        ->orderBy('name') // Panga kwa majina (A-Z)
        ->paginate(12) // Tumia paginate kwa pagination kamili
        ->withQueryString();

    return Inertia::render('Categories/Show', [
        'category' => new CategoryResource($category),
        'nominees' => NomineeResource::collection($nominees),
    ]);
}


    public function index(Request $request): Response
    {
        $search = $request->input('search');

        // Chagua makundi makuu (yale hayana mzazi)
        $categoryGroups = Category::query()
            ->whereNull('parent_id')
            // Pakia tuzo zilizo chini yake (children) na hesabu washiriki kwa kila tuzo
            ->with(['children' => function ($query) {
                $query->withCount('nominees')->orderBy('name', 'asc');
            }])
            // Ongeza uwezo wa kutafuta kwenye makundi makuu na tuzo zake
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%") // Tafuta kwenye jina la kundi kuu
                        ->orWhereHas('children', function ($childQuery) use ($search) {
                            $childQuery->where('name', 'like', "%{$search}%"); // Tafuta kwenye majina ya tuzo
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
