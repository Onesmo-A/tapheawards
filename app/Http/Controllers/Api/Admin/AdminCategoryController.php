<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    // ==========================================
    // CATEGORY GROUPS CRUD
    // ==========================================
    public function getGroups(): JsonResponse
    {
        $groups = CategoryGroup::latest()->get();
        return response()->json([
            'status' => 'success',
            'groups' => $groups
        ]);
    }

    public function storeGroup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:category_groups,name',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $group = CategoryGroup::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_CATEGORY_GROUP',
            modelType: CategoryGroup::class,
            modelId: $group->id,
            beforeState: null,
            afterState: $group->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kundi Kuu limeundwa kikamilifu.',
            'group' => $group
        ]);
    }

    public function updateGroup(Request $request, CategoryGroup $group): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:category_groups,name,' . $group->id,
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $before = $group->toArray();
        $group->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_CATEGORY_GROUP',
            modelType: CategoryGroup::class,
            modelId: $group->id,
            beforeState: $before,
            afterState: $group->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kundi Kuu limesasishwa.',
            'group' => $group
        ]);
    }

    public function deleteGroup(Request $request, CategoryGroup $group): JsonResponse
    {
        $before = $group->toArray();
        $group->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_CATEGORY_GROUP',
            modelType: CategoryGroup::class,
            modelId: $group->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kundi Kuu limefutwa kikamilifu.'
        ]);
    }

    // ==========================================
    // CATEGORIES CRUD
    // ==========================================
    public function getCategories(): JsonResponse
    {
        $categories = Category::with('group')->latest()->get();
        return response()->json([
            'status' => 'success',
            'categories' => $categories
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_group_id' => 'required|uuid|exists:category_groups,id',
            'status' => 'required|string|in:active,inactive',
            'voting_enabled' => 'required|boolean',
            'nomination_fee' => 'required|numeric|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . rand(100, 999);

        $category = Category::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_CATEGORY',
            modelType: Category::class,
            modelId: $category->id,
            beforeState: null,
            afterState: $category->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoria imeundwa kikamilifu.',
            'category' => $category
        ]);
    }

    public function updateCategory(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_group_id' => 'required|uuid|exists:category_groups,id',
            'status' => 'required|string|in:active,inactive',
            'voting_enabled' => 'required|boolean',
            'nomination_fee' => 'required|numeric|min:0',
        ]);

        $before = $category->toArray();
        $category->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_CATEGORY',
            modelType: Category::class,
            modelId: $category->id,
            beforeState: $before,
            afterState: $category->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoria imesasishwa kikamilifu.',
            'category' => $category
        ]);
    }

    public function deleteCategory(Request $request, Category $category): JsonResponse
    {
        $before = $category->toArray();
        $category->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_CATEGORY',
            modelType: Category::class,
            modelId: $category->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoria imefutwa kikamilifu.'
        ]);
    }

    public function toggleCategoryStatus(Request $request, Category $category): JsonResponse
    {
        $before = $category->toArray();
        $newStatus = $category->status === 'active' ? 'inactive' : 'active';
        $category->update([
            'status' => $newStatus
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'TOGGLE_CATEGORY_STATUS',
            modelType: Category::class,
            modelId: $category->id,
            beforeState: $before,
            afterState: $category->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => $newStatus === 'active' ? 'Kategoria imeamilishwa.' : 'Kategoria imesimamishwa.',
            'category' => $category
        ]);
    }
}
