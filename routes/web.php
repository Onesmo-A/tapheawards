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

// ========== User Dashboard (Protected) ==========
// Tumeunganisha routes zote za mtumiaji aliye-login hapa
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // 1. Onyesha list ya maombi (status)
    Route::get('/dashboard/applications', [NomineeApplicationController::class, 'index'])->name('user.applications.index');
    // 2. Mchakato wa Maombi
    // Hatua ya 1: Onyesha ukurasa wa kuchagua kategoria
    Route::get('/dashboard/applications/apply', [NomineeApplicationController::class, 'selectCategory'])->name('user.applications.selectCategory');
    // Hatua ya 2: Onyesha fomu ya kujaza kwa kategoria maalum
    Route::get('/dashboard/applications/create/{category}', [NomineeApplicationController::class, 'create'])->name('user.applications.create');
    // 3. Hifadhi maombi mapya
    Route::post('/dashboard/applications', [NomineeApplicationController::class, 'store'])->name('user.applications.store');
    // 4. Onyesha status ya ombi moja
    Route::get('/dashboard/applications/{application}', [NomineeApplicationController::class, 'show'])->name('user.applications.show');
    // 5. Retry payment
    Route::post('/dashboard/applications/{application}/retry-payment', [NomineeApplicationController::class, 'retryPayment'])->name('user.applications.retry-payment');

    // ========== Payment Gateway Routes ==========
    // Hapa mtumiaji atachagua njia ya malipo (ZenoPay, PayPal, etc)
    Route::get('/payment/select/{application}', [\App\Http\Controllers\PaymentController::class, 'selectGateway'])->name('payment.select');
    Route::post('/payment/process/{application}', [\App\Http\Controllers\PaymentController::class, 'processPayment'])->name('payment.process');
});

// ========== Admin Routes ==========
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Categories
    Route::get('/categories/export/all-pdf', [AdminCategoryController::class, 'exportAllPdf'])->name('categories.export.all-pdf');
    Route::resource('categories', AdminCategoryController::class);
    Route::get('/categories/{category}/export/pdf', [AdminCategoryController::class, 'exportPdf'])->name('categories.export.pdf');
    Route::get('/categories/export/all-pdf', [AdminCategoryController::class, 'exportAllPdf'])->name('categories.export.all-pdf');

    // Nominees
    Route::resource('nominees', AdminNomineeController::class)->except(['show']);
    Route::get('/nominees/export', [AdminNomineeController::class, 'export'])->name('nominees.export');

    // Votes
    Route::get('/votes', [AdminVoteController::class, 'index'])->name('votes.index');
    Route::get('/votes/export/pdf', [AdminVoteController::class, 'exportPdf'])->name('votes.export.pdf');

    // Reset Votes
    Route::post('/votes/reset', [AdminVoteController::class, 'reset'])->name('votes.reset');

    // Settings
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

    // Winner Management (CRUD)
    Route::resource('winners', WinnerController::class)->only(['index', 'store', 'destroy']);

    // Nominee Suggestions Management (Mapendekezo ya Wagombea)
    Route::get('/suggestions/export/pdf', [AdminSuggestionController::class, 'exportPdf'])->name('suggestions.export.pdf');

    // Nominee Applications Management (Maombi ya Ushiriki)
    // Tunatumia 'resource' lakini tunaondoa 'create', 'store', na 'edit' kwa sababu maombi yanatoka kwa watumiaji
    Route::resource('applications', AdminNomineeApplicationController::class)
        ->except(['create', 'store', 'edit']);
    Route::get('/applications/export/pdf', [AdminNomineeApplicationController::class, 'exportPdf'])->name('applications.export.pdf');

    // Transactions Management
    Route::resource('transactions', AdminTransactionController::class)->only(['index', 'show']);
    Route::get('/transactions/export/pdf', [AdminTransactionController::class, 'exportPdf'])->name('transactions.export.pdf');

    Route::get('/suggestions', [AdminSuggestionController::class, 'index'])->name('suggestions.index');
    // Guest Invitations Management
    Route::resource('invitations', AdminInvitationController::class)->except(['show']);
    Route::get('/invitations/export/pdf', [AdminInvitationController::class, 'exportPdf'])->name('invitations.export.pdf');
    Route::delete('/suggestions/{suggestion}', [AdminSuggestionController::class, 'destroy'])->name('suggestions.destroy');
    // Posts (Updates, Gallery, Events) Management
    Route::resource('posts', \App\Http\Controllers\Admin\PostController::class);

    // BORESHO: Admin Marathon Management
    Route::resource('marathon', \App\Http\Controllers\Admin\MarathonController::class)->only(['index', 'show'])->names('marathon');
    // BORESHO: Ongeza routes za export
    Route::get('/marathon/export/pdf', [\App\Http\Controllers\Admin\MarathonController::class, 'exportPdf'])->name('marathon.export.pdf');
    Route::get('/marathon/export/excel', [\App\Http\Controllers\Admin\MarathonController::class, 'exportExcel'])->name('marathon.export.excel');


    // BORESHO: Admin User Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
});
// ========== Auth User Profile ==========
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========== Public Routes ==========
Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/tickets', [PageController::class, 'getTickets'])->name('tickets.index');
Route::get('/participate', [PageController::class, 'participate'])->name('participate');

Route::get('/contact', [PageController::class, 'contact'])->name('contact.show');

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
