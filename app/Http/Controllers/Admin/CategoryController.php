<?php

namespace App\Http\Controllers\Admin;

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
        $search = $request->input('search');

        $query = Category::withCount('nominees')->latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('categories', 'public');
        } else {
            $validated['image_path'] = null;
        }

        Category::create($validated);

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
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            if ($category->image_path) {
                \Storage::disk('public')->delete($category->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

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

    // ✅ Export PDF report for a single category
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
