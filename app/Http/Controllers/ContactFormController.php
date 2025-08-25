<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactFormController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // Kwa sasa, tuta-log ujumbe. Kwenye production, utatumia Mail facade.
        Log::info('Contact Form Submission:', $validated);

        /*
        Mail::send('emails.contact', ['data' => $validated], function ($message) use ($validated) {
            $message->to('admin@tanzaniabusinessawards.co.tz', 'TBA Admin')
                    ->from($validated['email'], $validated['name'])
                    ->subject('Contact Form: ' . $validated['subject']);
        });
        */

        // Rudisha nyuma na ujumbe wa mafanikio.
        return back()->with('success', 'Message sent successfully!');
    }
}