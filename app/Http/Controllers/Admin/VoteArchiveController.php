<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeasonAward;
use App\Models\VoteArchive;
use App\Models\Vote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoteArchiveController extends Controller
{
    public function index()
    {
        $archives = VoteArchive::query()
            ->with(['seasonAward', 'category', 'nominee'])
            ->orderByDesc('archived_at')
            ->get();

        return Inertia::render('Admin/VoteArchives/Index', [
            'archives' => $archives,
            'seasons' => SeasonAward::orderByDesc('year')->get(['id', 'year', 'theme']),
        ]);
    }

    public function snapshot(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'season_award_id' => 'nullable|exists:season_awards,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($validated) {
            $rows = Vote::query()
                ->selectRaw('category_id, nominee_id, COUNT(*) as votes_count')
                ->groupBy('category_id', 'nominee_id')
                ->get();

            foreach ($rows as $row) {
                DB::table('vote_archives')->updateOrInsert(
                    [
                        'season_award_id' => $validated['season_award_id'] ?? null,
                        'category_id' => $row->category_id,
                        'nominee_id' => $row->nominee_id,
                    ],
                    [
                        'votes_count' => $row->votes_count,
                        'notes' => $validated['notes'] ?? null,
                        'archived_at' => now(),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
        });

        return back()->with('success', 'Vote archive snapshot imehifadhiwa kikamilifu.');
    }
}
