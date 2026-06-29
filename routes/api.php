<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VoteController;
use App\Models\NomineeApplication;
use Illuminate\Support\Facades\Log;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ========== Public API Routes ==========
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ========== Protected API Routes (Requires Token) ==========
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Status ya application
    Route::get('/applications/{application}/status', function (NomineeApplication $application) {
        abort_if($application->user_id !== auth()->id(), 403);
        return response()->json(['status' => $application->status]);
    })->name('api.applications.status');
});

// ========== Webhook Route ==========
// Hii route haina vizuizi vya 'web' (kama CSRF) na ni mahususi kwa ajili ya kupokea majibu kutoka mifumo ya nje.
Route::post('/webhooks/zenopay', [\App\Http\Controllers\WebhookController::class, 'handleZenoPay'])->name('api.webhooks.zenopay');
