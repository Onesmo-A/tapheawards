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
        // Pata mtumiaji aliyeingia
        $user = auth()->user();

        // Pata takwimu za maombi ya mtumiaji huyu pekee.
        $stats = [
            // Hesabu maombi yaliyokubaliwa ya mtumiaji huyu.
            'approved_applications' => $user->nomineeApplications()->where('status', NomineeApplication::STATUS_APPROVED)->count(),
            // Hesabu maombi yaliyokataliwa ya mtumiaji huyu.
            'rejected_applications' => $user->nomineeApplications()->where('status', NomineeApplication::STATUS_REJECTED)->count(),
        ];

        // Inarejesha component ya 'Dashboard/Index' na kutuma takwimu kama 'props'.
        return Inertia::render('Dashboard/Index', ['stats' => $stats]);
    }
}
