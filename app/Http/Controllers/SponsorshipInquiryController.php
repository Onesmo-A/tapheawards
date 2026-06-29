<?php

namespace App\Http\Controllers;

use App\Models\SponsorshipInquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SponsorshipInquiryController extends Controller
{
    /**
     * Store a new sponsorship inquiry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tier' => 'required|string|max:255',
            'price' => 'required|string|max:255',
        ]);

        try {
            SponsorshipInquiry::create($validated);
            return response()->json(['message' => 'Inquiry logged successfully.'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to log sponsorship inquiry', ['error' => $e->getMessage(), 'data' => $validated]);
            return response()->json(['message' => 'Could not log inquiry.'], 500);
        }
    }
}