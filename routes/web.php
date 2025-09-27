<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\AwardsController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MarathonController;

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\NomineeController as AdminNomineeController;
use App\Http\Controllers\Admin\VoteController as AdminVoteController;
use App\Http\Controllers\Admin\WinnerController;
use App\Http\Controllers\Admin\SuggestionController as AdminSuggestionController;
use App\Http\Controllers\Admin\NomineeApplicationController as AdminNomineeApplicationController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\InvitationController as AdminInvitationController;
use App\Http\Controllers\Admin\UserController as AdminUserController; // BORESHO: Ongeza
use App\Http\Controllers\Admin\TicketController as AdminTicketController;
use Inertia\Inertia;
use App\Http\Controllers\User\NomineeApplicationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\SitemapController;

// ========== Authentication Routes ==========
// Inajumuisha routes zote za uthibitishaji (login, register, password reset, etc.)
require __DIR__.'/auth.php';

// ========== Authenticated Routes (User & Admin) ==========
Route::middleware(['auth'])->group(function () {

    // --- User Specific Routes ---
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('dashboard')->name('user.')->group(function () {
        Route::get('/applications', [NomineeApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/apply', [NomineeApplicationController::class, 'selectCategory'])->name('applications.selectCategory');
        Route::get('/applications/create/{category}', [NomineeApplicationController::class, 'create'])->name('applications.create');
        Route::post('/applications', [NomineeApplicationController::class, 'store'])->name('applications.store');
        Route::get('/applications/{application}', [NomineeApplicationController::class, 'show'])->name('applications.show');
        Route::post('/applications/{application}/retry-payment', [NomineeApplicationController::class, 'retryPayment'])->name('applications.retry-payment');
    });

    // --- Payment Gateway Routes (for authenticated users) ---
    Route::get('/payment/select/{application}', [\App\Http\Controllers\PaymentController::class, 'selectGateway'])->name('payment.select');
    Route::post('/payment/process/{application}', [\App\Http\Controllers\PaymentController::class, 'processPayment'])->name('payment.process');

    // --- Profile Routes (for all authenticated users) ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Admin Only Routes ---
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Categories
        Route::resource('categories', AdminCategoryController::class);
        Route::get('/categories/{category}/export/pdf', [AdminCategoryController::class, 'exportPdf'])->name('categories.export.pdf');
        Route::get('/categories/export/all-pdf', [AdminCategoryController::class, 'exportAllPdf'])->name('categories.export.all-pdf');

        // Nominees
        Route::resource('nominees', AdminNomineeController::class)->except(['show']);
        Route::get('/nominees/export', [AdminNomineeController::class, 'export'])->name('nominees.export');

        // Votes
        Route::get('/votes', [AdminVoteController::class, 'index'])->name('votes.index');
        Route::get('/votes/export/pdf', [AdminVoteController::class, 'exportPdf'])->name('votes.export.pdf');
        Route::post('/votes/reset', [AdminVoteController::class, 'reset'])->name('votes.reset');

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

        // Winner Management
        Route::resource('winners', WinnerController::class)->only(['index', 'store', 'destroy']);

        // Suggestions
        Route::get('/suggestions', [AdminSuggestionController::class, 'index'])->name('suggestions.index');
        Route::delete('/suggestions/{suggestion}', [AdminSuggestionController::class, 'destroy'])->name('suggestions.destroy');
        Route::get('/suggestions/export/pdf', [AdminSuggestionController::class, 'exportPdf'])->name('suggestions.export.pdf');

        // Applications
        Route::resource('applications', AdminNomineeApplicationController::class)->except(['create', 'store', 'edit']);
        Route::get('/applications/export/pdf', [AdminNomineeApplicationController::class, 'exportPdf'])->name('applications.export.pdf');

        // Transactions
        Route::resource('transactions', AdminTransactionController::class)->only(['index', 'show']);
        Route::get('/transactions/export/pdf', [AdminTransactionController::class, 'exportPdf'])->name('transactions.export.pdf');

        // Invitations
        Route::resource('invitations', AdminInvitationController::class)->except(['show']);
        Route::get('/invitations/export/pdf', [AdminInvitationController::class, 'exportPdf'])->name('invitations.export.pdf');

        // Content Management (Posts, Albums, Reels)
        Route::resource('posts', \App\Http\Controllers\Admin\PostController::class)->names('posts');
        Route::resource('gallery-albums', \App\Http\Controllers\Admin\GalleryAlbumController::class)->names('gallery-albums');
        Route::resource('reels', \App\Http\Controllers\Admin\ReelController::class)->except(['show'])->names('reels');

        // Marathon Management
        Route::resource('marathon', \App\Http\Controllers\Admin\MarathonController::class)->only(['index', 'show'])->names('marathon');
        Route::get('/marathon/export/pdf', [\App\Http\Controllers\Admin\MarathonController::class, 'exportPdf'])->name('marathon.export.pdf');
        Route::get('/marathon/export/excel', [\App\Http\Controllers\Admin\MarathonController::class, 'exportExcel'])->name('marathon.export.excel');

        // User Management
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');

        // Ticket Management & Scanning
        Route::get('/tickets', [AdminTicketController::class, 'dashboard'])->name('tickets.dashboard');
        // BORESHO: Ongeza routes za kuunda tiketi kwa Admin
        Route::get('/tickets/create', [AdminTicketController::class, 'create'])->name('tickets.create');
        Route::post('/tickets', [AdminTicketController::class, 'store'])->name('tickets.store');
        Route::get('/tickets/scan', [AdminTicketController::class, 'showScanner'])->name('tickets.scan');
        Route::post('/tickets/verify', [AdminTicketController::class, 'verifyTicket'])->name('tickets.verify');
        // BORESHO: Ongeza route ya kutuma tiketi tena
        Route::post('/tickets/purchases/{purchase}/resend', [AdminTicketController::class, 'resendTicket'])->name('tickets.resend');
        // BORESHO: Ongeza routes za kusimamia Aina za Tiketi (Ticket Types)
        Route::resource('ticket-types', \App\Http\Controllers\Admin\TicketTypeController::class)->except(['show'])->names('ticket-types');


    });
});

// ========== Public Routes ==========
Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/participate', [PageController::class, 'participate'])->name('participate');

Route::get('/contact', [PageController::class, 'contact'])->name('contact.show');

// Ticket Purchasing Flow
Route::controller(TicketController::class)->prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/', 'index')->name('index'); // Ukurasa wa kuchagua tiketi
    Route::get('/purchase', 'showPurchaseForm')->name('purchase'); // Fomu ya kujaza taarifa
    Route::post('/purchase', 'processPurchase')->name('process'); // Kuanzisha muamala
    Route::get('/pending/{order_id}', 'pendingPayment')->name('pending'); // Ukurasa wa kusubiri malipo
    Route::get('/success/{order_id}', 'success')->name('success'); // Ukurasa wa mafanikio
    Route::get('/download/{order_id}', 'downloadPdf')->name('download'); // Route ya kupakua PDF
    Route::get('/status', 'checkStatus')->name('status'); // Endpoint ya AJAX kuangalia status
});

// Suggest a Nominee
Route::get('/suggest-nominee', [PageController::class, 'suggestNominee'])->name('nominees.suggest');
Route::post('/suggest-nominee', [SuggestionController::class, 'store'])->name('nominees.suggestion.store'); // Imebadilishwa jina la route

// Routes kwa ajili ya mrejesho wa fomu ya mapendekezo
Route::get('/suggestion/thanks', function () {
    return Inertia::render('Admin/Suggestions/Thanks', [
        'successMessage' => session('success', 'Pendekezo lako limepokelewa!'),
    ]);
})->name('suggestion.thanks');


Route::get('/suggestion/duplicate', function () {
    return Inertia::render('Admin/Suggestions/Duplicate', [
        'errorMessage' => session('error', 'Ushampendekeza mtu huyu katika kategoria hii.'),
    ]);
})->name('suggestion.duplicate');

Route::post('/contact', [ContactFormController::class, 'store'])->name('contact.store');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Sponsors
Route::get('/sponsors', [PageController::class, 'sponsors'])->name('sponsors.index');

// Awards Pages (legacy or other routes)
Route::get('/awards', [AwardsController::class, 'index'])->name('awards.index');
Route::get('/awards/winners', [AwardsController::class, 'winners'])->name('awards.winners');
Route::get('/results/{year}/{category:slug}', [AwardsController::class, 'resultsByCategory'])->name('awards.results.category');

// News & Gallery Pages
Route::get('/news', [NewsController::class, 'index'])->name('news.index');

Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('/gallery/{album:slug}', [GalleryController::class, 'show'])->name('gallery.show');
Route::get('/events', [EventController::class, 'index'])->name('events.index');


// Event Guests & Artists
Route::prefix('event')->group(function () {
    Route::get('/guest-of-honor', [EventController::class, 'guestOfHonor'])->name('event.guest-of-honor');
    Route::get('/artists', [EventController::class, 'artists'])->name('event.artists');
});

// ========== Marathon Routes (Public) ==========
Route::prefix('marathon')->name('marathon.')->group(function () {
    Route::get('/register', [MarathonController::class, 'create'])->name('register');
    Route::post('/register', [MarathonController::class, 'store'])->name('store');
    Route::get('/pending/{order_id}', [MarathonController::class, 'pendingPayment'])->name('pending');
    Route::get('/success', [MarathonController::class, 'success'])->name('success');
    Route::post('/check-status', [MarathonController::class, 'checkStatus'])->name('check-status'); // AJAX endpoint
    // BORESHO: Routes za kuangalia status
    Route::get('/check-status', [MarathonController::class, 'showCheckStatusPage'])->name('check-status-page');
    Route::post('/find-registration', [MarathonController::class, 'findRegistration'])->name('find-registration');
    // BORESHO: Routes za kulipia tena
    Route::get('/retry-payment/{order_id}', [MarathonController::class, 'showRetryPaymentPage'])->name('retry-payment');
    Route::post('/retry-payment', [MarathonController::class, 'processRetryPayment'])->name('process-retry-payment');
});

// ========== Invitation Card Route ==========
// Hii ni kwa ajili ya wageni maalum (VIPs) kuona mwaliko wao
Route::get('/invitation/{uuid}', [\App\Http\Controllers\InvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/{uuid}/rsvp', [\App\Http\Controllers\InvitationController::class, 'rsvp'])->name('invitation.rsvp');

Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// ========== Voting Endpoint ==========
// Hii ndiyo endpoint inayopokea maombi ya kura kutoka kwa frontend.
// Inalindwa na 'throttle:votes' (kutoka AppServiceProvider) kuzuia maombi mengi kwa wakati mmoja kutoka IP moja.
Route::post('/nominees/{nominee}/vote', [VoteController::class, 'store'])
    ->middleware('throttle:votes')
    ->name('nominees.vote');

// ========== Single Post Route ==========
// Imehamishwa hapa chini ili kuepuka mgongano na routes zingine
Route::get('/posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');



use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route as RouteFacade;

// ================== ROUTE YA MUDA KWA AJILI YA MAJARIBIO ==================
// Hii itakuruhusu kuigiza malipo yaliyokamilika kwa ajili ya ununuzi wa tiketi.
// Kumbuka kuifuta baada ya kumaliza majaribio.
// Route::get('/test/complete-ticket-purchase/{purchase}', function (\App\Models\TicketPurchase $purchase) {
//     if ($purchase->status === 'completed') {
//         return "This ticket purchase (ID: {$purchase->id}) is already completed.";
//     }

//     try {
//         DB::transaction(function () use ($purchase) {
//             // 1. Sasisha transaction iwe 'completed'
//             if ($purchase->mainTransaction) {
//                 $purchase->mainTransaction->update(['status' => 'completed']);
//             }

//             // 2. Sasisha ununuzi wenyewe uwe 'completed'
//             // Hii itasababisha 'booted()' method kwenye TicketPurchase model kuitwa
//             // na kutengeneza tiketi pamoja na kutuma email.
//             $purchase->update(['status' => 'completed']);
//         });

//         return "SUCCESS! Ticket purchase ID: {$purchase->id} has been marked as completed. Check your email for the tickets.";

//     } catch (\Exception $e) {
//         return "ERROR: Failed to complete purchase. " . $e->getMessage();
//     }
// })->name('test.complete.ticket');
