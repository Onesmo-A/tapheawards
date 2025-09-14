<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('About', [
            'title' => 'About The Awards',
            'description' => 'Learn more about the history, mission, and vision of the Tanzania Peaoples Health Excelence Awards.'
        ]);
    }

    public function getTickets(): Response
    {
        return Inertia::render('GetTickets', [
            'title' => 'Event Tickets',
            'description' => 'Secure your spot at the most anticipated awards night. Choose your ticket package and be part of the celebration.',
            'breadcrumbs' => [
                ['label' => 'Home', 'url' => route('home')],
                ['label' => 'Tickets', 'url' => null],
            ],
        ]);
    }

    public function sponsors(): Response
    {
        return Inertia::render('Sponsors/Index', [
            'title' => 'Our Sponsors & Partners',
            'description' => 'Partner with TAPHEA 2025 to celebrate excellence in healthcare and gain unparalleled visibility.',
            'breadcrumbs' => [
                ['label' => 'Home', 'url' => route('home')],
                ['label' => 'Sponsors', 'url' => null],
            ],
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Contact', [
            'title' => 'Contact Us',
            'description' => 'Have questions or need support? Get in touch with our team. We are here to help you with any inquiries.',
            'breadcrumbs' => [
                ['label' => 'Home', 'url' => route('home')],
                ['label' => 'Contact', 'url' => null],
            ],
        ]);
    }

    public function participate(): Response
    {
        $forms = [
            [
                'title' => 'Nomination Form for Individuals',
                'description' => 'Use this form to nominate an outstanding individual for the Tanzania Business Awards.',
                'url' => '/downloads/individual_nomination_form.pdf',
            ],
            [
                'title' => 'Company/Organization Application Form',
                'description' => 'Companies and organizations can use this form to apply for various award categories.',
                'url' => '/downloads/company_application_form.pdf',
            ],
            [
                'title' => 'Sponsorship Package Details',
                'description' => 'Learn more about our sponsorship opportunities and how you can partner with us.',
                'url' => '/downloads/sponsorship_package.pdf',
            ]
        ];

        return Inertia::render('Participate', ['title' => 'Participate & Download Forms', 'forms' => $forms]);
    }

     public function suggestNominee(): Response
    {
        // BORESHO JIPYA: Hii ni njia rahisi na ya moja kwa moja ya kupata kategoria za tuzo.
        // Inachagua kategoria zote ambazo ni ndogo (zina parent_id) na ziko 'active'.
        // Hii ndiyo njia sahihi na rahisi zaidi kulingana na ombi lako.
        $awardCategories = Category::query()
            ->where('status', 'active')      // 1. Hakikisha kategoria iko hai (active).
            ->whereNotNull('parent_id')     // 2. Hakikisha ni kategoria ndogo (ya tuzo, siyo kundi kuu).
            ->orderBy('name', 'asc')        // 3. Panga kwa herufi (A-Z).
            ->get(['id', 'name']);          // 4. Chagua 'id' na 'name' pekee.

              // Debug hapa - itaonyesha categories kwenye browser na kusimamisha script
    // dd($awardCategories);

        return Inertia::render('SuggestNominee', [
            'title' => 'Pendekeza Mashujaa wa Afya',
            'description' => 'Je, unamfahamu mtoa huduma wa afya, shirika, au taasisi inayostahili heshima? 
    TAPHE Awards inakupa nafasi ya kupendekeza wagombea katika kategoria mbalimbali 
    ili kutambua juhudi, ubunifu, na mchango mkubwa katika sekta ya afya nchini Tanzania.
',
            'categories' => $awardCategories,
        ]);
    }
    
}