<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SeasonAward;
use App\Models\Winner;

class SeasonAwardController extends Controller
{
    // Onyesha list ya season za awards
    public function index()
    {
        // Pata seasons zote, unaweza ku-adjust kama unataka paginate au order
        $seasons = SeasonAward::orderBy('year', 'desc')->get();

        return Inertia::render('Awards/Index', [
            'awardSeasons' => $seasons,
        ]);
    }

    // Onyesha winners kwa season fulani
    public function show($id)
    {
        $season = SeasonAward::findOrFail($id);
        // Pata winners wa season hii
        $winners = Winner::where('season_award_id', $season->id)->get();

        return Inertia::render('Awards/Show', [
            'season' => $season,
            'winners' => $winners,
        ]);
    }
}
