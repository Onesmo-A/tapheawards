<?php

namespace App\Http\Controllers;

use App\Models\GuestInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Onyesha kadi ya mwaliko kwa kutumia UUID.
     */
    public function show(string $uuid)
    {
        // Tafuta mwaliko kwa kutumia UUID. Kama haupo, rudisha 404.
        $invitation = GuestInvitation::where('uuid', $uuid)->firstOrFail();

        // Rekodi kuwa mwaliko umefunguliwa (kama ni mara ya kwanza)
        if ($invitation->status === 'sent' || $invitation->status === 'pending') {
            $invitation->update([
                'status' => 'viewed',
                'viewed_at' => now(),
            ]);
        }

        // Tuma data kwenye Vue component
        return Inertia::render('Invitations/Show', [
            'invitation' => $invitation,
            'event' => [ // Unaweza kutoa data hizi kutoka kwenye Settings baadaye
                'name' => 'TAPHE AWARDS LAUNCH EVENT',
                'date' => 'September 12, 2025',
                'time' => '6:00 PM - 11:00 PM',
                'venue' => 'King Jada Hotel, Morocco Square Building, DSM',
                'dress_code' => 'Maroon / Elegant',
            ],
            // Hii itaficha navigation na footer
            'layout' => 'blank', 
        ]);
    }

    /**
     * Hifadhi jibu la RSVP la mgeni.
     */
    public function rsvp(Request $request, string $uuid)
    {
        $validated = $request->validate([
            'status' => 'required|in:attending,declined',
        ]);

        $invitation = GuestInvitation::where('uuid', $uuid)->firstOrFail();

        // Zuia kubadilisha jibu kama tayari ameshajibu
        if ($invitation->rsvp_status !== 'pending') {
            return back()->with('warning', 'You have already submitted your RSVP.');
        }

        $invitation->update([
            'rsvp_status' => $validated['status'],
            'rsvp_at' => now(),
        ]);

        $message = $validated['status'] === 'attending'
            ? 'Thank you for attendance. We look forward to seeing you there !'
            : 'Thank you for declining your RSVP .';

        return back()->with('success', $message);
    }
}
