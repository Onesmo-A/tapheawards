<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\VotePackage;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminVotePackageController extends Controller
{
    /**
     * Retrieve all vote packages.
     */
    public function getPackages(): JsonResponse
    {
        $packages = VotePackage::orderBy('sort_order')->orderBy('votes')->get();
        return response()->json([
            'status' => 'success',
            'packages' => $packages
        ]);
    }

    /**
     * Create a new vote package.
     */
    public function storePackage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'votes' => 'required|integer|min:1|unique:vote_packages,votes',
            'price' => 'required|numeric|min:0',
            'label' => 'required|string|max:255',
            'sub' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        $package = VotePackage::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_VOTE_PACKAGE',
            modelType: VotePackage::class,
            modelId: $package->id,
            beforeState: null,
            afterState: $package->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi kimeundwa kikamilifu.',
            'package' => $package
        ]);
    }

    /**
     * Update an existing vote package.
     */
    public function updatePackage(Request $request, VotePackage $package): JsonResponse
    {
        $validated = $request->validate([
            'votes' => 'required|integer|min:1|unique:vote_packages,votes,' . $package->id,
            'price' => 'required|numeric|min:0',
            'label' => 'required|string|max:255',
            'sub' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = 0;
        }

        $before = $package->toArray();
        $package->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_VOTE_PACKAGE',
            modelType: VotePackage::class,
            modelId: $package->id,
            beforeState: $before,
            afterState: $package->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi limesasishwa.',
            'package' => $package
        ]);
    }

    /**
     * Delete a vote package.
     */
    public function deletePackage(Request $request, VotePackage $package): JsonResponse
    {
        $before = $package->toArray();
        $package->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_VOTE_PACKAGE',
            modelType: VotePackage::class,
            modelId: $package->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi limefutwa kikamilifu.'
        ]);
    }
}
