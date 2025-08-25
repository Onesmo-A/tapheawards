<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VoteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ========== Public API Routes ==========

// Hizi ni kwa ajili ya wateja wa nje (k.m. mobile app)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Njia hii ya upigaji kura inabaki kama ilivyo
Route::post('/vote/{nominee}', [VoteController::class, 'store'])
    ->name('api.votes.store') // Tumia jina tofauti kuepuka mgongano
    ->middleware('throttle:votes');

// ========== Protected API Routes (Requires Token) ==========
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());

    // Hapa ndipo utaweka njia za kulipia tiketi au fomu
    // Route::post('/tickets/purchase', [TicketController::class, 'purchase']);
    // Route::post('/nominee-forms/purchase', [NomineeFormController::class, 'purchase']);
});