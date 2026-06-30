<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NomineeController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\SponsorshipInquiryController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\AwardsController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MarathonController;
use App\Http\Controllers\InvitationController;
use App\Models\NomineeApplication;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // ========== Authentication ==========
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // ========== Welcome / Public Data ==========
    Route::get('/welcome/data', [WelcomeController::class, 'getApiData'])->name('api.welcome.data');

    // ========== Categories & Nominees ==========
    Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');
    Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('api.categories.show');
    Route::get('/nominees/{nominee}', [NomineeController::class, 'show'])->name('api.nominees.show');

    // ========== Paid Voting & OTP Routes ==========
    Route::get('/vote/packages', [VoteController::class, 'getPackages'])->name('api.vote.packages');
    Route::post('/vote/otp/request', [VoteController::class, 'requestOtp'])->name('api.vote.otp.request');
    Route::post('/vote/otp/verify', [VoteController::class, 'verifyOtp'])->name('api.vote.otp.verify');
    Route::post('/vote/initiate', [VoteController::class, 'initiatePaidVote'])->name('api.vote.initiate');
    Route::get('/vote/order/{order}/status', [VoteController::class, 'checkOrderStatus'])->name('api.vote.order.status');

    // ========== Contact & Sponsorship Inquiries ==========
    Route::post('/contact', [ContactFormController::class, 'store'])->name('api.contact.store');
    Route::post('/sponsorship-inquiries', [SponsorshipInquiryController::class, 'store'])->name('api.sponsorship.store');

    // ========== Suggest Nominee ==========
    Route::post('/suggestions', [SuggestionController::class, 'store'])->name('api.suggestions.store');

    // ========== Awards, Winners & Seasons ==========
    Route::get('/awards', [AwardsController::class, 'index'])->name('api.awards.index');
    Route::get('/awards/winners', [AwardsController::class, 'winners'])->name('api.awards.winners');
    Route::get('/awards/archives', [AwardsController::class, 'archives'])->name('api.awards.archives');
    Route::get('/awards/seasons/{seasonAward}', [AwardsController::class, 'showSeason'])->name('api.seasonAwards.show');

    // ========== News, Gallery & Events ==========
    Route::get('/news', [NewsController::class, 'index'])->name('api.news.index');
    Route::get('/gallery', [GalleryController::class, 'index'])->name('api.gallery.index');
    Route::get('/gallery/{album:slug}', [GalleryController::class, 'show'])->name('api.gallery.show');
    Route::get('/events', [EventController::class, 'index'])->name('api.events.index');
    Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('api.posts.show');

    // ========== Marathon Registration & Verification ==========
    Route::post('/marathon/register', [MarathonController::class, 'store'])->name('api.marathon.store');
    Route::post('/marathon/check-status', [MarathonController::class, 'checkStatus'])->name('api.marathon.check-status');
    Route::post('/marathon/find-registration', [MarathonController::class, 'findRegistration'])->name('api.marathon.find-registration');
    Route::post('/marathon/retry-payment', [MarathonController::class, 'processRetryPayment'])->name('api.marathon.process-retry-payment');

    // ========== VIP Invitation RSVP ==========
    Route::get('/invitation/{uuid}', [InvitationController::class, 'show'])->name('api.invitation.show');
    Route::post('/invitation/{uuid}/rsvp', [InvitationController::class, 'rsvp'])->name('api.invitation.rsvp');

    // ========== Webhook Routes (Gateways) ==========
    Route::post('/webhooks/zenopay', [\App\Http\Controllers\WebhookController::class, 'handleZenoPay'])->name('api.webhooks.zenopay');
    Route::post('/webhooks/azampay', [\App\Http\Controllers\WebhookController::class, 'handleAzamPayWebhook'])->name('api.webhooks.azampay');
    Route::post('/webhooks/malipopay', [\App\Http\Controllers\WebhookController::class, 'handleMalipoPayWebhook'])->name('api.webhooks.malipopay');

    // ========== Protected API Routes (Requires Token) ==========
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
        Route::get('/user', function (Request $request) {
            return $request->user();
        })->name('api.user');

        Route::get('/applications/{application}/status', function (NomineeApplication $application) {
            abort_if($application->user_id !== auth()->id(), 403);
            return response()->json(['status' => $application->status]);
        })->name('api.applications.status');
    });
});
