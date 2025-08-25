<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Display the gallery page.
     */
    public function index(): Response
    {
        // Kwa sasa, tunaonyesha ukurasa tu. Baadaye, unaweza kupakia picha kutoka database hapa.
        return Inertia::render('Gallery/Index');
    }
}