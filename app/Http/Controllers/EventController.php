<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('Event/Index', [
            'event' => [
                'date' => '2025-12-31',
                'time' => '18:00',
                'venue' => 'Mlimani City Conference Centre'
            ]
        ]);
    }

    public function guestOfHonor()
    {
        return Inertia::render('Event/GuestOfHonor', [
            'guest' => [
                'name' => 'Hon. January Makamba',
                'title' => 'Minister of Energy',
                'image' => '/images/guest-of-honor.jpg',
                'bio' => 'Distinguished leader with extensive experience...'
            ]
        ]);
    }

    public function schedule()
    {
        return Inertia::render('Event/Schedule', [
            'schedule' => [
                ['time' => '18:00', 'event' => 'Registration & Networking'],
                ['time' => '19:00', 'event' => 'Opening Ceremony'],
                // ... more events
            ]
        ]);
    }

    public function venue()
    {
        return Inertia::render('Event/Venue');
    }

    public function artists()
    {
        return Inertia::render('Event/Artists', [
            'artists' => [
                // List of performing artists
            ]
        ]);
    }
}
