<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nominee;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminNomineeController extends Controller
{
    public function getNominees(): JsonResponse
    {
        $nominees = Nominee::with('category')->latest()->get();
        return response()->json([
            'status' => 'success',
            'nominees' => $nominees
        ]);
    }

    public function storeNominee(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|uuid|exists:categories,id',
            'bio' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
            'is_suspended' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = \App\Services\ImageOptimizer::optimizeAndStore($request->file('image'), 'nominees');
        }

        $validated['image_path'] = $imagePath;

        $nominee = Nominee::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_NOMINEE',
            modelType: Nominee::class,
            modelId: $nominee->id,
            beforeState: null,
            afterState: $nominee->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mgombea amesajiliwa kikamilifu.',
            'nominee' => $nominee
        ]);
    }

    public function updateNominee(Request $request, Nominee $nominee): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|uuid|exists:categories,id',
            'bio' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
            'is_suspended' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($nominee->image_path && Storage::disk('public')->exists($nominee->image_path)) {
                Storage::disk('public')->delete($nominee->image_path);
            }
            $validated['image_path'] = \App\Services\ImageOptimizer::optimizeAndStore($request->file('image'), 'nominees');
        }

        $before = $nominee->toArray();
        $nominee->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_NOMINEE',
            modelType: Nominee::class,
            modelId: $nominee->id,
            beforeState: $before,
            afterState: $nominee->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Taarifa za mgombea zimesasishwa.',
            'nominee' => $nominee
        ]);
    }

    public function deleteNominee(Request $request, Nominee $nominee): JsonResponse
    {
        $before = $nominee->toArray();
        $nominee->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_NOMINEE',
            modelType: Nominee::class,
            modelId: $nominee->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mgombea amefutwa kikamilifu.'
        ]);
    }

    public function toggleSuspension(Request $request, Nominee $nominee): JsonResponse
    {
        $before = $nominee->toArray();
        $nominee->update([
            'is_suspended' => !$nominee->is_suspended
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'TOGGLE_NOMINEE_SUSPENSION',
            modelType: Nominee::class,
            modelId: $nominee->id,
            beforeState: $before,
            afterState: $nominee->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => $nominee->is_suspended ? 'Mgombea amesimamishwa.' : 'Mgombea ameruhusiwa kupigiwa kura.',
            'nominee' => $nominee
        ]);
    }
}
