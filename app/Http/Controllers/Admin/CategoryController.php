<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Http\RedirectResponse;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        // Boresho: Tumia page size inayotolewa na mtumiaji kwa admin list.
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->input('per_page', 20);
        $allowedPerPage = ['20', '50', '100', 'all'];
        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = '20';
        }

        $query = Category::withCount(['nominees' => function ($query) {
                $query->where('is_suspended', false);
            }])
            ->with('parent') // Pakia mzazi wa kila kategoria
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByRaw('ISNULL(parent_id) DESC, parent_id, name') // Boresho: Panga wazazi kwanza, kisha watoto wao
            ->orderBy('name');

        if ($perPage === 'all') {
            $perPage = max($query->count(), 1);
        }

        $categories = $query->paginate((int) $perPage)->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function toggleStatus(Category $category): RedirectResponse
    {
        $category->update([
            'status' => $category->status === 'active' ? 'inactive' : 'active',
        ]);

        return back()->with('success', 'Category status updated successfully.');
    }

    public function toggleVoting(Category $category): RedirectResponse
    {
        $category->update([
            'voting_enabled' => ! $category->voting_enabled,
        ]);

        return back()->with('success', $category->voting_enabled ? 'Voting enabled for this category.' : 'Voting disabled for this category.');
    }

    public function create()
    {
        // Tuma kategoria zote zinazoweza kuwa wazazi (parent) kwenda kwenye fomu
        $parentCategories = Category::whereNull('parent_id')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => $parentCategories,
        ]);
    }

  public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name' => 'required|string|max:255|unique:categories,name,NULL,id,parent_id,' . ($request->parent_id ?? 'NULL'),
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        'parent_id' => 'nullable|exists:categories,id',
        'status' => 'required|in:active,inactive',
        // Ongeza validation kwa nomination_fee
        'nomination_fee' => 'nullable|numeric|min:0|required_if:parent_id,!=,null',
    ]);

    $category = new Category();
    $category->name = $validated['name'];
    $category->slug = Str::slug($validated['name']);
    $category->description = $validated['description'] ?? null;
    $category->nomination_fee = $request->parent_id ? ($validated['nomination_fee'] ?? 0) : 0;
    $category->parent_id = $validated['parent_id'] ?? null; // Hapa ndo key
    $category->status = $validated['status'];

    if ($request->hasFile('image')) {
        $category->image_path = \App\Services\ImageOptimizer::optimizeAndStore($request->file('image'), 'categories');
    }

    $category->save();

    return redirect()->route('admin.categories.index')
        ->with('success', 'Category created successfully.');
}

    public function show(Category $category)
    {
        $category->load(['nominees' => function ($query) {
            $query->orderBy('name');
        }]);

        return Inertia::render('Admin/Categories/Show', [
            'category' => $category,
            'nominees' => $category->nominees,
        ]);
    } 

    
    public function edit(Category $category)
    {
        // Tuma kategoria zote zinazoweza kuwa wazazi, isipokuwa kategoria yenyewe
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            // Boresha sheria ya 'unique' kwa ajili ya 'update'
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id . ',id,parent_id,' . ($request->parent_id ?? 'NULL'),
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:active,inactive',
            // Ongeza validation kwa nomination_fee
            'nomination_fee' => 'nullable|numeric|min:0|required_if:parent_id,!=,null',
        ]);

        $category->name = $validated['name'];
        $category->slug = Str::slug($validated['name']);
        $category->description = $validated['description'] ?? null;
        $category->parent_id = $validated['parent_id'] ?? null;
        $category->nomination_fee = $request->parent_id ? ($validated['nomination_fee'] ?? 0) : 0;
        $category->status = $validated['status'];

        if ($request->hasFile('image')) {
            if ($category->image_path) {
                \Storage::disk('public')->delete($category->image_path);
            }
            $category->image_path = \App\Services\ImageOptimizer::optimizeAndStore($request->file('image'), 'categories');
        }

        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->image_path) {
            \Storage::disk('public')->delete($category->image_path);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    
    public function exportPdf(Category $category)
    {
        $nominees = $category->nominees()
            ->orderBy('name')
            ->get();

        $totalVotes = $nominees->sum('votes_count');

        $data = [
            'title' => 'Category Results Report: ' . $category->name,
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'category' => $category,
            'nominees' => $nominees,
            'totalVotes' => $totalVotes,
        ];

        $pdf = PDF::loadView('reports.category_results_pdf', $data);
        $slug = Str::slug('category-report-' . $category->name);

        return $pdf->download($slug . '.pdf');
    }

    // ✅ Export PDF report for all categories with nominees
    public function exportAllPdf()
    {
        // Build export structure as: Main group -> Category -> Nominees
        // Include main groups even if they have no categories.
        $mainGroups = Category::query()
            ->whereNull('parent_id')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $mainGroups = $mainGroups->values();

        $mainGroups->each(function (Category $mainGroup) {
            $categories = Category::query()
                ->where('parent_id', $mainGroup->id)
                ->where('status', 'active')
                ->orderBy('name')
                ->get();

            $categories->each(function (Category $category) {
                $nominees = $category->nominees()
                    ->where('is_suspended', false)
                    ->orderBy('name')
                    ->get();

                // Calculate total votes per category
                $category->totalVotes = $nominees->sum('votes_count');

                // Attach nominees collection to a loaded relation so the blade can loop reliably
                $category->setRelation('nominees', $nominees);
            });

            // Attach categories as a dynamic relation for the view
            $mainGroup->setRelation('export_categories', $categories);
        });

        $data = [
            'title' => 'Results Report for All Categories',
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'mainGroups' => $mainGroups,
        ];

        $pdf = PDF::loadView('reports.all_categories_results_pdf', $data);

        return $pdf->download('all-categories-results-report.pdf');
    }
}
