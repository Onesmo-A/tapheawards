# Technical Implementation Plan: Full Admin Panel Expansion

This document presents the implementation details for transforming the TAPHE Secure Admin Panel into a fully featured administrative control hub.

## User Review Required

> [!IMPORTANT]
> The admin area is fully single-page based (React SPA) and uses client-side routing. We will configure standard RESTful JSON APIs on the Laravel backend under `/api/v1/admin/...` rather than legacy Inertia renders, aligning with the actual project frontend architecture.

---

## Proposed Changes

We will implement dedicated REST APIs and React view controllers grouped by domain area.

### 1. Database & Backend API Services

#### [NEW] [AdminCrudController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/Api/Admin/AdminCrudController.php)
We will create a clean controller containing all resource CRUD actions for content and activities:
- **Categories CRUD**: Listing, creating, updating, and deleting categories (`Category`).
- **Nominees CRUD**: Listing, creating, updating, suspending/reactivating, and deleting nominees (`Nominee`).
- **Hero Banners CRUD**: CRUD actions for `HeroBanner`.
- **Sponsors CRUD**: CRUD actions for `Sponsor`.
- **Gallery Albums CRUD**: CRUD actions for `GalleryAlbum`.
- **Posts & Reels CRUD**: CRUD actions for news/photos (`Post`) and video clips (`Reel`).
- **Applications & Suggestions Review**:
  - Approve suggestion -> Auto-instantiate nominee record.
  - Approve/Reject application -> Review actions with audit log stamps.
- **Ticket Registry**: View all ticket purchases (`TicketPurchase`) with quantity details and check-in updates.
- **Marathon Registry**: List all participants, search, filter by status, and export controls.
- **System settings**: General parameters, Timelines step names/dates, Event Location venue info.

#### [MODIFY] [api.php](file:///c:/xampp/htdocs/taphe_online/routes/api.php)
Register the new API endpoints under the protected Sanctum and admin middleware block:
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Categories CRUD
    Route::get('/crud/categories', [AdminCrudController::class, 'getCategories']);
    Route::post('/crud/categories', [AdminCrudController::class, 'storeCategory']);
    Route::put('/crud/categories/{category}', [AdminCrudController::class, 'updateCategory']);
    Route::delete('/crud/categories/{category}', [AdminCrudController::class, 'deleteCategory']);

    // Nominees CRUD
    Route::get('/crud/nominees', [AdminCrudController::class, 'getNominees']);
    Route::post('/crud/nominees', [AdminCrudController::class, 'storeNominee']);
    Route::put('/crud/nominees/{nominee}', [AdminCrudController::class, 'updateNominee']);
    Route::delete('/crud/nominees/{nominee}', [AdminCrudController::class, 'deleteNominee']);
    Route::post('/crud/nominees/{nominee}/toggle-suspension', [AdminCrudController::class, 'toggleSuspension']);

    // Content CRUD (Sponsors, Banners, Gallery, Posts, Reels)
    Route::get('/content/sponsors', [AdminCrudController::class, 'getSponsors']);
    Route::post('/content/sponsors', [AdminCrudController::class, 'storeSponsor']);
    Route::delete('/content/sponsors/{sponsor}', [AdminCrudController::class, 'deleteSponsor']);

    Route::get('/content/banners', [AdminCrudController::class, 'getBanners']);
    Route::post('/content/banners', [AdminCrudController::class, 'storeBanner']);
    Route::delete('/content/banners/{banner}', [AdminCrudController::class, 'deleteBanner']);

    Route::get('/content/albums', [AdminCrudController::class, 'getAlbums']);
    Route::post('/content/albums', [AdminCrudController::class, 'storeAlbum']);
    Route::delete('/content/albums/{album}', [AdminCrudController::class, 'deleteAlbum']);

    Route::get('/content/posts', [AdminCrudController::class, 'getPosts']);
    Route::post('/content/posts', [AdminCrudController::class, 'storePost']);
    Route::delete('/content/posts/{post}', [AdminCrudController::class, 'deletePost']);

    Route::get('/content/reels', [AdminCrudController::class, 'getReels']);
    Route::post('/content/reels', [AdminCrudController::class, 'storeReel']);
    Route::delete('/content/reels/{reel}', [AdminCrudController::class, 'deleteReel']);

    // User Activities
    Route::get('/activity/applications', [AdminCrudController::class, 'getApplications']);
    Route::post('/activity/applications/{application}/review', [AdminCrudController::class, 'reviewApplication']);
    
    Route::get('/activity/suggestions', [AdminCrudController::class, 'getSuggestions']);
    Route::post('/activity/suggestions/{suggestion}/approve', [AdminCrudController::class, 'approveSuggestion']);

    Route::get('/activity/users', [AdminCrudController::class, 'getUsers']);

    Route::get('/registry/tickets', [AdminCrudController::class, 'getTicketPurchases']);
    Route::post('/registry/tickets/{ticket}/check-in', [AdminCrudController::class, 'checkInTicket']);

    Route::get('/registry/marathons', [AdminCrudController::class, 'getMarathonRegistrations']);
});
```

---

### 2. Frontend React Sidebar & CRUD Subsystems

#### [MODIFY] [AdminDashboard.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Admin/AdminDashboard.tsx)
We will expand the dashboard to implement a comprehensive sidebar structure with collapsible submenus and a full tabbed content panel:

1. **Collapsible Sidebar Submenus**:
   - **Content Management**: Sub-links to Categories, Nominees, Gallery Albums, Hero Banners, Sponsors, Posts, Reels.
   - **User Activity**: Sub-links to Applications, Suggestions, Transactions, Users list.
   - **Voting Desk**: Sub-links to Live Votes, Vote Audit Integrity Scan.
   - **Marathon Desk**: Sub-link to Marathon Registrations table.
   - **Tickets Desk**: Sub-link to Ticket Sales, Ticket Check-in list.
   - **Settings**: System configurations.

2. **CRUD View Panels**:
   - **Categories CRUD Panel**: Table listing categories, quick create modal, edit modal, delete validation checks.
   - **Nominees CRUD Panel**: Candidate details, Category assign dropdown, toggle suspension flags, photo file input placeholder.
   - **Content Managers (Banners, Sponsors, Gallery, Posts, Reels)**: Forms/Modals to add, view lists, and delete.
   - **Applications Review Desk**: List incoming applications with applicant info, biography and social media links. Include approve/reject buttons.
   - **Suggestions Desk**: List suggested nominees. Include a button to auto-create a nominee directly from the suggestion.
   - **Transactions Desk**: Complete transaction table with gateways (AzamPay/MalipoPay/ZenoPay) status checking.
   - **Marathon & Ticket Registry Desks**: Display registrations lists with checked-in counters and ticket statuses.

---

## Verification Plan

### Automated Tests
- Extend the test suite to cover category/nominee CRUD APIs and application approvals:
  `php artisan test`

### Manual Verification
1. Login with credentials `info@tapheawards.co.tz` / `secretariat@taphe` + OTP code.
2. Navigate all sidebar links to confirm navigation state is stored correctly.
3. Perform CRUD actions on Categories and Nominees; verify the changes appear on the public pages.
