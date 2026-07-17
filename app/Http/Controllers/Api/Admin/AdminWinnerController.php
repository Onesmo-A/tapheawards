<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Winner;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminWinnerController extends Controller
{
    public function getWinners(): JsonResponse
    {
        $winners = Winner::with(['category', 'nominee'])->latest()->get();
        return response()->json([
            'status' => 'success',
            'winners' => $winners
        ]);
    }

    public function storeWinner(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|uuid|exists:categories,id',
            'nominee_id' => 'required|uuid|exists:nominees,id',
            'year' => 'required|integer|min:2000|max:2100',
        ]);

        $exists = Winner::where('category_id', $validated['category_id'])
            ->where('year', $validated['year'])
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mshindi wa kategoria hii kwa mwaka huu tayari ashatangazwa.'
            ], 422);
        }

        $nominee = \App\Models\Nominee::find($validated['nominee_id']);
        if (!$nominee || $nominee->votes_count <= 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Huwezi kumtangaza mshindi ambaye ana kura 0.'
            ], 422);
        }

        $winner = Winner::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DECLARE_WINNER',
            modelType: Winner::class,
            modelId: $winner->id,
            beforeState: null,
            afterState: $winner->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mshindi ametangazwa rasmi.',
            'winner' => $winner
        ]);
    }

    public function deleteWinner(Request $request, Winner $winner): JsonResponse
    {
        $before = $winner->toArray();
        $winner->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_WINNER',
            modelType: Winner::class,
            modelId: $winner->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mshindi amefutwa rasmi.'
        ]);
    }
}
