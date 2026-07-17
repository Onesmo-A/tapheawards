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
        // Auto-run schema modification to add missing columns dynamically in local environment
        if (!\Illuminate\Support\Facades\Schema::hasColumn('sponsorship_inquiries', 'company_name')) {
            \Illuminate\Support\Facades\Schema::table('sponsorship_inquiries', function ($table) {
                $table->string('company_name')->nullable();
                $table->string('contact_name')->nullable();
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->text('message')->nullable();
            });
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone'        => 'required|string|max:30',
            'tier'         => 'required|string|max:255',
            'message'      => 'required|string|max:5000',
        ]);

        // Pricing estimation based on selected tier
        $priceMap = [
            'platinum' => '20,000,000 TZS',
            'gold'     => '10,000,000 TZS',
            'silver'   => '5,000,000 TZS',
        ];
        $validated['price'] = $priceMap[strtolower($validated['tier'])] ?? 'Custom Quote';
        $validated['status'] = 'new';

        try {
            $inquiry = SponsorshipInquiry::create($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Thank you! Your corporate sponsorship inquiry has been received. Our secretariat will contact you shortly.',
                'inquiry' => $inquiry
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to log sponsorship inquiry', ['error' => $e->getMessage(), 'data' => $validated]);
            return response()->json(['message' => 'System error occurred while submitting inquiry. Please call secretariat.'], 500);
        }
    }
}