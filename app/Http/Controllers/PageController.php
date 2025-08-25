<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('About', [
            'title' => 'About The Awards',
            'description' => 'Learn more about the history, mission, and vision of the Tanzania Business Awards.'
        ]);
    }

    public function getTickets()
    {
        return Inertia::render('GetTickets', [
            'title' => 'Get Your Tickets',
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'title' => 'Contact Us',
        ]);
    }

    public function participate()
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
}