<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

if (!function_exists('App\Helpers\setting')) {
    /**
     * Get the value of a setting from the database.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    function setting($key, $default = null)
    {
        $settings = Cache::rememberForever('app_settings', function () {
            return Setting::all()->pluck('value', 'key');
        });

        return $settings->get($key, $default);
    }
}

if (!function_exists('App\Helpers\public_storage_url')) {
    /**
     * Resolve a path stored on the public disk to the app's public URL.
     */
    function public_storage_url(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        if (str_starts_with($path, 'file/storage/')) {
            $path = substr($path, strlen('file/storage/'));
        }

        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        return Storage::disk('public')->url($path);
    }
}
