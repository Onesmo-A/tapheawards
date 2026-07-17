<?php

namespace App\Http\Controllers;

use App\Models\SponsorshipPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class SponsorshipPackageController extends Controller
{
    /**
     * Helper to auto-create and seed sponsorship packages table dynamically if needed.
     */
    protected function ensureTableAndSeeded(): void
    {
        if (!Schema::hasTable('sponsorship_packages')) {
            // Create table programmatically
            Schema::create('sponsorship_packages', function ($table) {
                $table->uuid('id')->primary();
                $table->string('name');
                $table->string('slug')->unique();
                $table->decimal('price', 15, 2)->default(0);
                $table->string('price_formatted');
                $table->text('description')->nullable();
                $table->json('benefits')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_popular')->default(false);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // Check if table is empty, seed default records
        if (SponsorshipPackage::count() === 0) {
            $seeder = new \Database\Seeders\SponsorshipPackageSeeder();
            $seeder->run();
        }
    }

    /**
     * Retrieve active sponsorship packages.
     */
    public function index(): JsonResponse
    {
        $this->ensureTableAndSeeded();

        $packages = SponsorshipPackage::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'packages' => $packages,
        ]);
    }

    /**
     * Admin: Retrieve all sponsorship packages (including inactive ones).
     */
    public function getAdminPackages(): JsonResponse
    {
        $this->ensureTableAndSeeded();

        $packages = SponsorshipPackage::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'packages' => $packages,
        ]);
    }

    /**
     * Admin: Create a new sponsorship package.
     */
    public function storePackage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'price'           => 'required|numeric|min:0',
            'price_formatted' => 'required|string|max:255',
            'description'     => 'required|string|max:1000',
            'benefits'        => 'required|array',
            'is_popular'      => 'required|boolean',
            'sort_order'      => 'required|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = true;

        // Check for duplicate slug
        if (SponsorshipPackage::where('slug', $validated['slug'])->exists()) {
            return response()->json(['message' => 'Sponsorship package name already exists.'], 422);
        }

        $package = SponsorshipPackage::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi kipya kimefanikiwa kusajiliwa.',
            'package' => $package,
        ], 210);
    }

    /**
     * Admin: Update a sponsorship package.
     */
    public function updatePackage(Request $request, SponsorshipPackage $package): JsonResponse
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'price'           => 'required|numeric|min:0',
            'price_formatted' => 'required|string|max:255',
            'description'     => 'required|string|max:1000',
            'benefits'        => 'required|array',
            'is_popular'      => 'required|boolean',
            'sort_order'      => 'required|integer',
            'is_active'       => 'required|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Check duplicate excluding self
        if (SponsorshipPackage::where('slug', $validated['slug'])->where('id', '!=', $package->id)->exists()) {
            return response()->json(['message' => 'Sponsorship package name already exists.'], 422);
        }

        $package->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi kimefanikiwa kuhaririwa.',
            'package' => $package,
        ]);
    }

    /**
     * Admin: Toggle visibility status of a package.
     */
    public function togglePackageStatus(Request $request, SponsorshipPackage $package): JsonResponse
    {
        $package->update([
            'is_active' => !$package->is_active
        ]);

        return response()->json([
            'status' => 'success',
            'message' => $package->is_active ? 'Kifurushi kimekuwa kionekane.' : 'Kifurushi kimefichwa.',
            'package' => $package,
        ]);
    }

    /**
     * Admin: Delete a package.
     */
    public function deletePackage(SponsorshipPackage $package): JsonResponse
    {
        $package->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kifurushi kimefutwa kabisa.',
        ]);
    }
}
