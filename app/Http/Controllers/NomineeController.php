<?php

namespace App\Http\Controllers;

use App\Http\Resources\NomineeResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Nominee;
use App\Services\Voting\VoteSessionService;
use Inertia\Inertia;
use Inertia\Response;
class NomineeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Pata washiriki kwa kutumia pagination kuzuia kupakua data yote kwa pamoja.
        // Hii ni muhimu sana kwa performance ya ukurasa.
        // Tumeondoa withCount('votes') na tunatumia NomineeResource
        $nominees = Nominee::with('category')->latest()->paginate(12);
        return NomineeResource::collection($nominees);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Nominee $nominee, Request $request, VoteSessionService $voteSessionService): Response
    {
        $nominee->load('category');

        return Inertia::render('Nominees/Show', [
            'nominee' => new NomineeResource($nominee),
            'category' => $nominee->category ? [
                'id' => $nominee->category->id,
                'name' => $nominee->category->name,
            ] : null,
            'voteSession' => $voteSessionService->issue($nominee, $request),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
