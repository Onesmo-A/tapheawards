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

// Sitemaps or other specific non-SPA paths can be placed here if needed:
// Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// Catch-all route for Single Page Application
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
