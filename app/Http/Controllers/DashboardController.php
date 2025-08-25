<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index(Request $request): Response
    {
        // Inarejesha component ya 'Dashboard/Index' kama ulivyoomba.
        return Inertia::render('Dashboard/Index');
    }
}
