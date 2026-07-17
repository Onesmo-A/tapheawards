<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Nominee;
use Illuminate\Http\JsonResponse;

class AdminVoteController extends Controller
{
    /**
     * Get list of categories with sorted live vote standings.
     */
    public function getVoteStandings(): JsonResponse
    {
        $categories = Category::with(['nominees' => function ($query) {
            $query->orderBy('votes_count', 'desc');
        }, 'group'])->get();

        return response()->json([
            'status' => 'success',
            'standings' => $categories
        ]);
    }

    /**
     * Get list of nominees with live vote counts.
     */
    public function getNominees(): JsonResponse
    {
        $nominees = Nominee::with('category')
            ->orderBy('votes_count', 'desc')
            ->get()
            ->map(function ($nominee) {
                return [
                    'id'           => $nominee->id,
                    'name'         => $nominee->name,
                    'image_url'    => $nominee->image_url,
                    'category_name'=> $nominee->category?->name ?? 'N/A',
                    'category_id'  => $nominee->category_id,
                    'votes_count'  => (int) $nominee->votes_count,
                    'is_suspended' => (bool) $nominee->is_suspended,
                ];
            });

        return response()->json([
            'status'   => 'success',
            'nominees' => $nominees
        ]);
    }
}
