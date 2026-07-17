# Technical Implementation Plan: Admin Panel Expansion & Advanced Controls

This plan details the implementation of advanced administrative controls, exports, live votes standings, winners management, pagination, and statistics enhancement.

## Proposed Changes

### 1. Database & Backend API Endpoints

#### [MODIFY] [AdminCrudController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/Api/Admin/AdminCrudController.php)
We will add:
- `toggleCategoryStatus`: An endpoint to toggle a Category status between `active` and `inactive`.
- `getVoteStandings`: An endpoint to return all categories and their nominees sorted by `votes_count` desc.
- `getWinners`, `storeWinner`, `deleteWinner`: Endpoints to fetch all declared winners, declare a new winner for a specific category/year, and delete/rescind a winner.

#### [MODIFY] [api.php](file:///c:/xampp/htdocs/taphe_online/routes/api.php)
Register the new endpoints under protected admin routing middleware:
```php
Route::post('/crud/categories/{category}/toggle-status', [AdminCrudController::class, 'toggleCategoryStatus']);
Route::get('/votes/standings', [AdminCrudController::class, 'getVoteStandings']);
Route::get('/crud/winners', [AdminCrudController::class, 'getWinners']);
Route::post('/crud/winners', [AdminCrudController::class, 'storeWinner']);
Route::delete('/crud/winners/{winner}', [AdminCrudController::class, 'deleteWinner']);
```

---

### 2. Frontend React Sidebar & Control Components

#### [MODIFY] [AdminDashboard.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Admin/AdminDashboard.tsx)

We will implement the following features:

##### A. Sidebar Navigation Additions
- **Winners Desk** and **Votes Standings** sub-links in the sidebar menu under the "Voting Desk" category.
- **Export Center** sub-link in the sidebar.

##### B. Toggle Category and Nominee States
- Add direct Toggle buttons inside categories list to suspend/activate them (`active` / `inactive`).
- Ensure nominee suspension toggle handles updates seamlessly.

##### C. Categories Nomination Fee Visibility
- Update the Category table list to highlight nomination fee price tags clearly in a badge.
- Update public pages to show the price tag next to categories where a fee is required.

##### D. Live Votes Standings Page (New Tab)
- Create a beautiful interface that displays categories, their respective nominees, and real-time vote totals sorted descending.
- Add search and filtration by category.

##### E. Winners Announcement Desk (New Tab)
- Add a panel listing all declared winners grouped by year.
- Create a declaration modal allowing admins to pick a Category, select from its verified Nominees, set the year, and declare them a Winner.
- Integrate delete action to rescind/remove declarations.

##### F. Tables Pagination & Items-Per-Page Selector
- Implement local pagination across all main CRUD tables (Nominees, Categories, Groups, Marathon, Tickets, Suggestions, Applications, Transactions, Audit logs).
- Add size filters: `5`, `10`, `25`, `50`, `100`, or `All` entries.

##### G. Export Center (New Tab & In-Table Buttons)
- Create client-side export functions generating clean Excel/CSV worksheets for:
  - Categories list (names, slug, group name, nomination fee, status).
  - Nominees list (name, category, vote count, suspension state).
  - Marathon Registrations (full name, phone, email, status, collections).
  - Ticket Sales (purchaser, ticket type, quantity, payment status, code).
- Place individual export buttons next to each table header for quick download.

---

## Verification Plan

### Automated Steps
1. Run Laravel route listings:
   `php artisan route:list`
2. Compile and bundle frontend assets:
   `npm run build`

### Manual Verification
1. Login to Admin Panel, confirm the new sidebar links (Votes Standings, Winners Desk, Export Center).
2. Create/edit category and verify that nomination fee shows correctly on categories page.
3. Test toggling active/suspended status for both categories and nominees.
4. Test declaring a nominee as a winner and viewing the list.
5. Export CSV files and verify structure.
