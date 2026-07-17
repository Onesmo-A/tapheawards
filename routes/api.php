<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\UserPortalController;
use App\Http\Controllers\Api\Admin\AdminOverviewController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminNomineeController;
use App\Http\Controllers\Api\Admin\AdminVoteController;
use App\Http\Controllers\Api\Admin\AdminWinnerController;
use App\Http\Controllers\Api\Admin\AdminContentController;
use App\Http\Controllers\Api\Admin\AdminActivityController;
use App\Http\Controllers\Api\Admin\AdminRegistryController;
use App\Http\Controllers\Api\Admin\AdminExportController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NomineeController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\SponsorshipInquiryController;
use App\Http\Controllers\SponsorshipPackageController;
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
    Route::get('/vote/otp/challenge', [VoteController::class, 'getChallenge'])->name('api.vote.otp.challenge');
    Route::post('/vote/otp/request', [VoteController::class, 'requestOtp'])->name('api.vote.otp.request');
    Route::post('/vote/otp/verify', [VoteController::class, 'verifyOtp'])->name('api.vote.otp.verify');
    Route::post('/vote/initiate', [VoteController::class, 'initiatePaidVote'])->name('api.vote.initiate');
    Route::get('/vote/order/{order}/status', [VoteController::class, 'checkOrderStatus'])->name('api.vote.order.status');

    // ========== Contact & Sponsorship Inquiries ==========
    Route::post('/contact', [ContactFormController::class, 'store'])->name('api.contact.store');
    Route::post('/sponsorship-inquiries', [SponsorshipInquiryController::class, 'store'])->name('api.sponsorship.store');
    Route::get('/sponsorship-packages', [SponsorshipPackageController::class, 'index'])->name('api.sponsorship-packages.index');

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
    // ========== VIP Invitation RSVP ==========
    Route::get('/invitation/{uuid}', [InvitationController::class, 'show'])->name('api.invitation.show');
    Route::post('/invitation/{uuid}/rsvp', [InvitationController::class, 'rsvp'])->name('api.invitation.rsvp');

    // ========== Webhook Routes (Gateways) ==========
    Route::post('/webhooks/zenopay', [\App\Http\Controllers\WebhookController::class, 'handleZenoPay'])->name('api.webhooks.zenopay');
    Route::post('/webhooks/zenopay/fake', [\App\Http\Controllers\WebhookController::class, 'simulateZenoPayWebhook'])->name('api.webhooks.zenopay.fake');
    Route::post('/webhooks/azampay', [\App\Http\Controllers\WebhookController::class, 'handleAzamPayWebhook'])->name('api.webhooks.azampay');
    Route::post('/webhooks/malipopay', [\App\Http\Controllers\WebhookController::class, 'handleMalipoPayWebhook'])->name('api.webhooks.malipopay');

    // ========== Admin Unprotected Auth Routes ==========
    Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('api.admin.login');
    Route::post('/admin/login/verify', [AdminAuthController::class, 'verifyOtp'])->name('api.admin.verify');

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

        Route::get('/user/dashboard/stats', [UserPortalController::class, 'getDashboardStats'])->name('api.user.dashboard.stats');
        Route::get('/user/categories', [UserPortalController::class, 'getCategories'])->name('api.user.categories');
        Route::get('/user/applications', [UserPortalController::class, 'getApplications'])->name('api.user.applications');
        Route::post('/user/applications', [UserPortalController::class, 'storeApplication'])->name('api.user.applications.store');
        Route::get('/user/tickets', [UserPortalController::class, 'getTickets'])->name('api.user.tickets');
        Route::post('/user/profile/update', [UserPortalController::class, 'updateProfile'])->name('api.user.profile.update');
        Route::post('/user/profile/password', [UserPortalController::class, 'updatePassword'])->name('api.user.profile.password');
        Route::post('/user/applications/{application}/retry-payment', [UserPortalController::class, 'retryApplicationPayment'])->name('api.user.applications.retry-payment');
    });

    // ========== Admin Protected Dashboard Routes ==========
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminOverviewController::class, 'getStats'])->name('api.admin.stats');
        Route::get('/settings', [AdminSettingsController::class, 'getSettings'])->name('api.admin.settings');
        Route::post('/settings', [AdminSettingsController::class, 'updateSettings'])->middleware('admin.role:super_admin')->name('api.admin.settings.update');
        Route::get('/logs', [AdminActivityController::class, 'getAuditLogs'])->name('api.admin.logs');
        Route::post('/votes/verify', [AdminActivityController::class, 'verifyVoteIntegrity'])->middleware('admin.role:super_admin,auditor')->name('api.admin.votes.verify');
        Route::get('/transactions', [AdminActivityController::class, 'getTransactions'])->name('api.admin.transactions');
        Route::get('/security/vote-attempts', [AdminActivityController::class, 'getVoteAttemptLogs'])->middleware('admin.role:super_admin,auditor')->name('api.admin.security.vote-attempts');
        Route::get('/nominees', [AdminVoteController::class, 'getNominees'])->name('api.admin.nominees');

        // Category Groups CRUD
        Route::get('/crud/groups', [AdminCategoryController::class, 'getGroups']);
        Route::post('/crud/groups', [AdminCategoryController::class, 'storeGroup'])->middleware('admin.role:super_admin');
        Route::put('/crud/groups/{group}', [AdminCategoryController::class, 'updateGroup'])->middleware('admin.role:super_admin');
        Route::delete('/crud/groups/{group}', [AdminCategoryController::class, 'deleteGroup'])->middleware('admin.role:super_admin');

        // Categories CRUD
        Route::get('/crud/categories', [AdminCategoryController::class, 'getCategories']);
        Route::post('/crud/categories', [AdminCategoryController::class, 'storeCategory'])->middleware('admin.role:super_admin');
        Route::put('/crud/categories/{category}', [AdminCategoryController::class, 'updateCategory'])->middleware('admin.role:super_admin');
        Route::delete('/crud/categories/{category}', [AdminCategoryController::class, 'deleteCategory'])->middleware('admin.role:super_admin');
        Route::post('/crud/categories/{category}/toggle-status', [AdminCategoryController::class, 'toggleCategoryStatus'])->middleware('admin.role:super_admin');

        // Nominees CRUD
        Route::get('/crud/nominees', [AdminNomineeController::class, 'getNominees']);
        Route::post('/crud/nominees', [AdminNomineeController::class, 'storeNominee'])->middleware('admin.role:super_admin');
        Route::put('/crud/nominees/{nominee}', [AdminNomineeController::class, 'updateNominee'])->middleware('admin.role:super_admin');
        Route::delete('/crud/nominees/{nominee}', [AdminNomineeController::class, 'deleteNominee'])->middleware('admin.role:super_admin');
        Route::post('/crud/nominees/{nominee}/toggle-suspension', [AdminNomineeController::class, 'toggleSuspension'])->middleware('admin.role:super_admin');

        // Live Votes Standings & Winners CRUD
        Route::get('/votes/standings', [AdminVoteController::class, 'getVoteStandings']);
        Route::get('/crud/winners', [AdminWinnerController::class, 'getWinners']);
        Route::post('/crud/winners', [AdminWinnerController::class, 'storeWinner'])->middleware('admin.role:super_admin');
        Route::delete('/crud/winners/{winner}', [AdminWinnerController::class, 'deleteWinner'])->middleware('admin.role:super_admin');

        // Sponsorship Packages CRUD
        Route::get('/crud/sponsorship-packages', [SponsorshipPackageController::class, 'getAdminPackages']);
        Route::post('/crud/sponsorship-packages', [SponsorshipPackageController::class, 'storePackage'])->middleware('admin.role:super_admin');
        Route::put('/crud/sponsorship-packages/{package}', [SponsorshipPackageController::class, 'updatePackage'])->middleware('admin.role:super_admin');
        Route::post('/crud/sponsorship-packages/{package}/toggle-status', [SponsorshipPackageController::class, 'togglePackageStatus'])->middleware('admin.role:super_admin');
        Route::delete('/crud/sponsorship-packages/{package}', [SponsorshipPackageController::class, 'deletePackage'])->middleware('admin.role:super_admin');

        // Vote Packages CRUD
        Route::get('/crud/vote-packages', [\App\Http\Controllers\Api\Admin\AdminVotePackageController::class, 'getPackages']);
        Route::post('/crud/vote-packages', [\App\Http\Controllers\Api\Admin\AdminVotePackageController::class, 'storePackage'])->middleware('admin.role:super_admin');
        Route::put('/crud/vote-packages/{package}', [\App\Http\Controllers\Api\Admin\AdminVotePackageController::class, 'updatePackage'])->middleware('admin.role:super_admin');
        Route::delete('/crud/vote-packages/{package}', [\App\Http\Controllers\Api\Admin\AdminVotePackageController::class, 'deletePackage'])->middleware('admin.role:super_admin');

        // Content CRUD (Sponsors, Banners, Gallery, Posts, Reels)
        Route::get('/content/sponsors', [AdminContentController::class, 'getSponsors']);
        Route::post('/content/sponsors', [AdminContentController::class, 'storeSponsor'])->middleware('admin.role:super_admin,content_manager');
        Route::put('/content/sponsors/{sponsor}', [AdminContentController::class, 'updateSponsor'])->middleware('admin.role:super_admin,content_manager');
        Route::post('/content/sponsors/{sponsor}/toggle-status', [AdminContentController::class, 'toggleSponsorStatus'])->middleware('admin.role:super_admin,content_manager');
        Route::delete('/content/sponsors/{sponsor}', [AdminContentController::class, 'deleteSponsor'])->middleware('admin.role:super_admin,content_manager');

        Route::get('/content/banners', [AdminContentController::class, 'getBanners']);
        Route::post('/content/banners', [AdminContentController::class, 'storeBanner'])->middleware('admin.role:super_admin,content_manager');
        Route::delete('/content/banners/{banner}', [AdminContentController::class, 'deleteBanner'])->middleware('admin.role:super_admin,content_manager');

        Route::get('/content/albums', [AdminContentController::class, 'getAlbums']);
        Route::post('/content/albums', [AdminContentController::class, 'storeAlbum'])->middleware('admin.role:super_admin,content_manager');
        Route::delete('/content/albums/{album}', [AdminContentController::class, 'deleteAlbum'])->middleware('admin.role:super_admin,content_manager');

        Route::get('/content/posts', [AdminContentController::class, 'getPosts']);
        Route::post('/content/posts', [AdminContentController::class, 'storePost'])->middleware('admin.role:super_admin,content_manager');
        Route::delete('/content/posts/{post}', [AdminContentController::class, 'deletePost'])->middleware('admin.role:super_admin,content_manager');

        Route::get('/content/reels', [AdminContentController::class, 'getReels']);
        Route::post('/content/reels', [AdminContentController::class, 'storeReel'])->middleware('admin.role:super_admin,content_manager');
        Route::delete('/content/reels/{reel}', [AdminContentController::class, 'deleteReel'])->middleware('admin.role:super_admin,content_manager');

        // User Activities
        Route::get('/activity/applications', [AdminActivityController::class, 'getApplications']);
        Route::post('/activity/applications/{application}/review', [AdminActivityController::class, 'reviewApplication'])->middleware('admin.role:super_admin,content_manager');
        
        Route::get('/activity/suggestions', [AdminActivityController::class, 'getSuggestions']);
        Route::post('/activity/suggestions/{suggestion}/approve', [AdminActivityController::class, 'approveSuggestion'])->middleware('admin.role:super_admin,content_manager');

        Route::get('/activity/users', [AdminActivityController::class, 'getUsers']);
        Route::get('/activity/sponsorships', [AdminActivityController::class, 'getSponsorships']);
        Route::post('/activity/sponsorships/{inquiry}/contacted', [AdminActivityController::class, 'markSponsorshipContacted'])->middleware('admin.role:super_admin,content_manager');

        // Ticket Registry
        Route::get('/registry/tickets', [AdminRegistryController::class, 'getTicketPurchases']);
        Route::post('/registry/tickets/{ticket}/check-in', [AdminRegistryController::class, 'checkInTicket'])->middleware('admin.role:super_admin,content_manager');
        Route::post('/registry/tickets/check-in-by-code', [AdminRegistryController::class, 'checkInTicketByCode'])->middleware('admin.role:super_admin,content_manager');
        
        // Ticket Types CRUD
        Route::get('/registry/ticket-types', [AdminRegistryController::class, 'getTicketTypes']);
        Route::post('/registry/ticket-types', [AdminRegistryController::class, 'storeTicketType'])->middleware('admin.role:super_admin');
        Route::put('/registry/ticket-types/{ticketType}', [AdminRegistryController::class, 'updateTicketType'])->middleware('admin.role:super_admin');
        Route::post('/registry/ticket-types/{ticketType}/toggle-status', [AdminRegistryController::class, 'toggleTicketTypeStatus'])->middleware('admin.role:super_admin');
        Route::delete('/registry/ticket-types/{ticketType}', [AdminRegistryController::class, 'deleteTicketType'])->middleware('admin.role:super_admin');

        // Marathon Registry
        Route::get('/registry/marathons', [AdminRegistryController::class, 'getMarathonRegistrations']);

        // Branded PDF Exports
        Route::get('/export/tickets/pdf', [AdminExportController::class, 'exportTicketsPdf'])->middleware('admin.role:super_admin,auditor');
        Route::get('/export/marathons/pdf', [AdminExportController::class, 'exportMarathonsPdf'])->middleware('admin.role:super_admin,auditor');
        Route::get('/export/standings/pdf', [AdminExportController::class, 'exportStandingsPdf'])->middleware('admin.role:super_admin,auditor');
    });
});






