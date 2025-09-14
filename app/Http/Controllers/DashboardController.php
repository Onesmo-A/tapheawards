<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\NomineeApplication;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index(): Response
    {
        // BORESHO: Pata takwimu halisi kwa ajili ya dashboard ya mtumiaji.
        $stats = [
            // BORESHO: Hesabu jumla ya kategoria za tuzo zinazopokea maombi.
            // Hizi ni kategoria ndogo (zina parent_id) na ziko 'active'.
            'award_categories' => Category::where('status', 'active')->whereNotNull('parent_id')->count(),
            // Hesabu maombi yote yaliyokubaliwa.
            'approved_applications' => NomineeApplication::where('status', NomineeApplication::STATUS_APPROVED)->count(),
            // Hesabu maombi yote yaliyokataliwa.
            'rejected_applications' => NomineeApplication::where('status', NomineeApplication::STATUS_REJECTED)->count(),
        ];

        // Inarejesha component ya 'Dashboard/Index' na kutuma takwimu kama 'props'.
        return Inertia::render('Dashboard/Index', ['stats' => $stats]);
    }
}
