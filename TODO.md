# TODO - All Categories Results PDF Export

## Steps
- [x] Update `exportAllPdf()` in `app/Http/Controllers/Admin/CategoryController.php` to build a grouped structure: Main group → Category → Nominees.
- [x] Ensure Main groups are included even when they have no categories (show `No category` + `No nominee`).
- [x] Ensure categories are included even when they have no nominees (show `No nominee`).
- [x] Update `resources/views/reports/all_categories_results_pdf.blade.php` layout to render Main group header then Category sections then nominees tables.
- [x] Keep ordering: Main groups (name asc), Categories (name asc), Nominees (name asc).
- [ ] Quick manual test: generate `all-categories-results-report.pdf` and verify edge cases.


