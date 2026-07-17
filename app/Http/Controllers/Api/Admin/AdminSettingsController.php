<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminSettingsController extends Controller
{
    /**
     * Retrieve system settings.
     */
    public function getSettings(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json([
            'status' => 'success',
            'settings' => $settings
        ]);
    }

    /**
     * Update system settings.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        $admin = $request->user();
        $oldState = Setting::all()->pluck('value', 'key')->toArray();

        foreach ($request->input('settings') as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        $newState = Setting::all()->pluck('value', 'key')->toArray();

        // Write audit trail log
        AuditLoggerService::log(
            adminUserId: $admin->id,
            action: 'UPDATE_SYSTEM_SETTINGS',
            modelType: Setting::class,
            modelId: 'global_settings',
            beforeState: $oldState,
            afterState: $newState
        );

        // Clear app cache
        Cache::forget('app_settings');

        return response()->json([
            'status' => 'success',
            'message' => 'Mipangilio imesasishwa kikamilifu.'
        ]);
    }
}
