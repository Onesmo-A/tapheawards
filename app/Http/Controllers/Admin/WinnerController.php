<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // 👉 ONGEZA HII
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Winner;
use Inertia\Inertia;

class WinnerController extends Controller
{
    use AuthorizesRequests; // 👉 ONGEZA HII

    
    public function index(Request $request)
    {
        $this->authorize('viewAny', Winner::class);

        $year = $request->input('year', date('Y'));

        $categories = Category::with(['nominees' => function ($query) {
            $query->orderBy('votes_count', 'desc');
        }])
            ->with(['winners' => function ($query) use ($year) {
                $query->where('year', $year);
            }])
            ->get()
            ->map(function ($category) {
                // Attach the winner nominee directly to the category for easier access in Vue
                $winner = $category->winners->first();
                $category->winner_nominee_id = $winner ? $winner->nominee_id : null;
                return $category;
            });

        return Inertia::render('Admin/Winners/Index', [
            'categories' => $categories,
            'currentYear' => (int)$year,
            'filters' => ['year' => $year],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Winner::class);

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'nominee_id' => 'required|exists:nominees,id',
            'year' => 'required|integer|min:2020|max:2100',
        ]);

        // Use updateOrCreate to handle both new and existing winner declarations for a category/year
        Winner::updateOrCreate(
            [
                'category_id' => $request->category_id,
                'year' => $request->year,
            ],
            [
                'nominee_id' => $request->nominee_id,
            ]
        );

        return back()->with('success', 'Winner declared successfully!');
    }
}
