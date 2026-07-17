# Technical Implementation Plan: Category Groups Schema & Frontend Restructuring

This document outlines the design to split the self-referential categories parent-child relation into two separate, dedicated database tables (`category_groups` and `categories`), and restructure the frontend to display them grouped cleanly.

## User Review Required

> [!WARNING]
> This structural change requires resetting the categories data schema. We will write a database migration that creates the `category_groups` table, alters `categories` to use `category_group_id`, and refactors seeders. We will then execute `php artisan migrate:fresh --seed` to reload the system with structured seed data.

---

## Proposed Changes

### 1. Database Schema & Models

#### [NEW] [Migration file](file:///c:/xampp/htdocs/taphe_online/database/migrations/2026_07_01_002300_create_category_groups_and_split_categories.php)
Create a new migration to:
- Establish the `category_groups` table with `id` (UUID primary key), `name`, `slug`, and `description`.
- Alter `categories` table: remove `parent_id` and add foreign key column `category_group_id` constrained to `category_groups`.

#### [NEW] [CategoryGroup.php](file:///c:/xampp/htdocs/taphe_online/app/Models/CategoryGroup.php)
Implement the `CategoryGroup` Eloquent model with a `hasMany` relationship:
```php
public function categories() {
    return $this->hasMany(Category::class, 'category_group_id');
}
```

#### [MODIFY] [Category.php](file:///c:/xampp/htdocs/taphe_online/app/Models/Category.php)
- Remove `$fillable['parent_id']` and add `$fillable['category_group_id']`.
- Replace self-referential relations (`parent()`, `children()`) with a `belongsTo` relation pointing to `CategoryGroup`.

#### [MODIFY] [CategorySeeder.php](file:///c:/xampp/htdocs/taphe_online/database/seeders/CategorySeeder.php)
Refactor seeder to insert groups into `category_groups` first, then insert awards linked to their group IDs.

---

### 2. Backend API Controllers & Resources

#### [MODIFY] [CategoryResource.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Resources/CategoryResource.php)
Include the category group name and ID:
```php
'category_group_id' => $this->category_group_id,
'group_name' => $this->group?->name,
```

#### [MODIFY] [AdminCrudController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/Api/Admin/AdminCrudController.php)
- **Category Groups CRUD**: Add endpoints `getGroups()`, `storeGroup()`, `updateGroup()`, `deleteGroup()`.
- **Categories CRUD**: Modify `storeCategory()` and `updateCategory()` to validate and save `category_group_id` instead of `parent_id`. Include the list of category groups in get endpoints.

#### [MODIFY] [WelcomeController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/WelcomeController.php), [CategoryController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/CategoryController.php), [PageController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/PageController.php), [SitemapController.php](file:///c:/xampp/htdocs/taphe_online/app/Http/Controllers/SitemapController.php)
Update queries that previously checked for `parent_id` (e.g. `whereNull('parent_id')` or `whereNotNull('parent_id')`) to use standard group queries.

---

### 3. Frontend React Views

#### [MODIFY] [AdminDashboard.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Admin/AdminDashboard.tsx)
- Re-design the categories section into a sub-tabbed component: **Category Groups** and **Categories**.
- In the Category form, replace the self-referential parent selection with a dropdown select listing all registered Category Groups loaded from the database.

#### [MODIFY] [Categories.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Categories.tsx)
- Restructure the UI to list categories grouped under their parent Category Group headers, preventing layout collision and providing a clear focus sector outline.

---

## Verification Plan

### Automated Steps
1. Run database refresh migrations and seeds:
   `php artisan migrate:fresh --seed`
2. Run Laravel unit tests:
   `php artisan test`
3. Compile all SPA bundle files:
   `npm run build`
