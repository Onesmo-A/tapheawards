<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Nominee;
use App\Models\Vote;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'categories' => Category::count(),
            'nominees' => Nominee::count(),
            'votes' => Vote::count(),
        ];

        // Get categories with the sum of votes from their nominees
        $categoryVotes = Category::withSum('nominees', 'votes_count')
            ->orderBy('nominees_sum_votes_count', 'desc')
            ->get(['id', 'name', 'nominees_sum_votes_count']);

        // Get top 5 nominees by votes
        $topNominees = Nominee::with('category')
            ->orderBy('votes_count', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'categoryVotes' => $categoryVotes,
            'topNominees' => $topNominees,
        ]);
    }
}