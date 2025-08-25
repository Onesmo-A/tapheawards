<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    /**
     * Display the news page.
     */
    public function index(): Response
    {
        // Kwa sasa, tunaonyesha ukurasa tu. Baadaye, unaweza kupakia habari kutoka database hapa.
        return Inertia::render('News/Index');
    }
}