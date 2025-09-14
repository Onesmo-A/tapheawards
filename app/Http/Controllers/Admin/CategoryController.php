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
        // Boresho: Pata kategoria zote na uzipange kimuundo (mzazi na watoto)
        // Hii itasaidia kuonyesha mpangilio sahihi kwenye ukurasa wa 'Index.vue'
        $categories = Category::withCount('nominees')
            ->with('parent') // Pakia mzazi wa kila kategoria
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByRaw('ISNULL(parent_id) DESC, parent_id, name') // Boresho: Panga wazazi kwanza, kisha watoto wao
            ->orderBy('name')
            ->paginate(20) // Ongeza idadi kidogo ili kuonyesha makundi vizuri
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
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
        $category->image_path = $request->file('image')->store('categories', 'public');
    }

    $category->save();

    return redirect()->route('admin.categories.index')
        ->with('success', 'Category created successfully.');
}

    public function show(Category $category)
    {
        $category->load(['nominees' => function ($query) {
            $query->orderBy('votes_count', 'desc');
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
            $category->image_path = $request->file('image')->store('categories', 'public');
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
            ->orderBy('votes_count', 'desc')
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
        // Load all categories that have nominees, sorted by name
        $categories = Category::with(['nominees' => function ($query) {
            $query->orderBy('votes_count', 'desc');
        }])
        ->withCount('nominees')
        ->having('nominees_count', '>', 0)
        ->orderBy('name')
        ->get();

        // Calculate total votes per category
        $categories->each(function ($category) {
            $category->totalVotes = $category->nominees->sum('votes_count');
        });

        $data = [
            'title' => 'Results Report for All Categories',
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'categories' => $categories,
        ];

        $pdf = PDF::loadView('reports.all_categories_results_pdf', $data);

        return $pdf->download('all-categories-results-report.pdf');
    }
}
