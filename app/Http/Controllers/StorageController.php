<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class StorageController extends Controller
{
    public function serve(string $path)
    {
        $path = str_replace('..', '', $path);

        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        $fullPath = Storage::disk('public')->path($path);

        if (!file_exists($fullPath) || !is_file($fullPath)) {
            abort(404, 'File not found');
        }

        $storagePath = Storage::disk('public')->path('');
        if (strpos(realpath($fullPath), realpath($storagePath)) !== 0) {
            abort(403, 'Access denied');
        }

        return response()->file($fullPath, [
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
