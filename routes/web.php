<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| In this decoupled architecture, all web requests are routed directly to the
| React SPA index page. Client-side routing is handled by React Router.
|
*/

Route::get('/run-migration-temp-xyz', function() {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return response()->json([
            'status' => 'success',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Catch-all route for Single Page Application
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');


