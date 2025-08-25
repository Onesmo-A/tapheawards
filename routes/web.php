<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AwardsController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MediaController;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Inertia\Inertia;

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\NomineeController as AdminNomineeController;
use App\Http\Controllers\Admin\VoteController as AdminVoteController;
use App\Http\Controllers\Admin\WinnerController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\User\NomineeApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\SitemapController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ========== API-Driven Auth Routes (New) ==========
// Hizi routes zitaonyesha kurasa za Vue zinazotumia API yetu.
Route::middleware('guest')->group(function () {
    // Bado unaweza kuonyesha component zako za Vue hapa
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Password Reset Routes
    // Hizi routes zinahitajika ili 'Forgot Password' ifanye kazi
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

// ========== User Dashboard (Protected) ==========
// Tumeunganisha routes zote za mtumiaji aliye-login hapa
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // 1. Onyesha list ya maombi (status)
    Route::get('/dashboard/applications', [NomineeApplicationController::class, 'index'])->name('user.applications.index');
    // 2. Onyesha ukurasa wa kuchagua category
    Route::get('/dashboard/applications/apply', [NomineeApplicationController::class, 'create'])->name('user.applications.create');
    // 3. Hifadhi maombi mapya
    Route::post('/dashboard/applications', [NomineeApplicationController::class, 'store'])->name('user.applications.store');
    // 4. Onyesha status ya ombi moja
    Route::get('/dashboard/applications/{application}', [NomineeApplicationController::class, 'show'])->name('user.applications.show');
    // 5. Retry payment
    Route::post('/dashboard/applications/{application}/retry-payment', [NomineeApplicationController::class, 'retryPayment'])->name('user.applications.retry-payment');
});

// ========== Logout Route ==========
// Hii route itashughulikia ombi la kutoka (logout) na inalindwa na 'auth' middleware
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');

// ========== Admin Routes ==========
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
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

    // Reset Votes
    Route::post('/votes/reset', [AdminVoteController::class, 'reset'])->name('votes.reset');

    // Settings
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

    //Winner Management
    Route::get('/winners', [WinnerController::class, 'index'])->name('winners.index');
    Route::post('/winners', [WinnerController::class, 'store'])->name('winners.store');
});

// ========== Auth User Profile ==========
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ========== Public Routes ==========
// require __DIR__.'/auth.php'; // Tumezima hii ili kutumia routes zetu mpya za API


Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/tickets', [PageController::class, 'getTickets'])->name('tickets.index');
Route::get('/participate', [PageController::class, 'participate'])->name('participate');

Route::get('/contact', [PageController::class, 'contact'])->name('contact.show');
Route::post('/contact', [ContactFormController::class, 'store'])->name('contact.store');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Awards Pages (legacy or other routes)
Route::get('/awards', [AwardsController::class, 'index'])->name('awards.index');
Route::get('/awards/winners', [AwardsController::class, 'winners'])->name('awards.winners');
Route::get('/results/{year}/{category:slug}', [AwardsController::class, 'resultsByCategory'])->name('awards.results.category');

// News & Gallery Pages
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');

// Event Guests & Artists
Route::prefix('event')->group(function () {
    Route::get('/guest-of-honor', [EventController::class, 'guestOfHonor'])->name('event.guest-of-honor');
    Route::get('/artists', [EventController::class, 'artists'])->name('event.artists');
});

Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// ========== Webhook Routes ==========
// Hizi hazihitaji authentication ya mtumiaji lakini zinahitaji usalama wake.
use App\Http\Controllers\WebhookController;
Route::post('/webhooks/zenopay', [WebhookController::class, 'handleZenoPay'])->name('webhooks.zenopay');