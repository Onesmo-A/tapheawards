<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use App\Models\NomineeApplication;
use App\Models\TicketPurchase;
use App\Models\MarathonRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;

class UserPortalController extends Controller
{
    /**
     * Get user dashboard summary stats.
     */
    public function getDashboardStats(Request $request)
    {
        $user = $request->user();

        $totalApplications = NomineeApplication::where('user_id', $user->id)->count();
        $approvedApplications = NomineeApplication::where('user_id', $user->id)
            ->where('status', NomineeApplication::STATUS_APPROVED)
            ->count();

        $totalTickets = TicketPurchase::where('user_id', $user->id)
            ->where('status', TicketPurchase::STATUS_COMPLETED)
            ->sum('quantity');

        $marathonRegistrations = MarathonRegistration::where('email', $user->email)
            ->where('status', MarathonRegistration::STATUS_COMPLETED)
            ->count();

        return response()->json([
            'stats' => [
                'total_applications' => $totalApplications,
                'approved_applications' => $approvedApplications,
                'total_tickets' => (int) $totalTickets,
                'marathon_registrations' => $marathonRegistrations,
            ]
        ]);
    }

    /**
     * Get user nominee applications.
     */
    public function getApplications(Request $request)
    {
        $applications = NomineeApplication::where('user_id', $request->user()->id)
            ->with(['category:id,name', 'transaction'])
            ->latest()
            ->get();

        return response()->json([
            'applications' => $applications
        ]);
    }

    /**
     * Get active award categories list.
     */
    public function getCategories(Request $request)
    {
        $categories = Category::where('status', 'active')
            ->orderBy('name')
            ->select('id', 'name', 'nomination_fee')
            ->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Submit a new nomination application and initiate payment.
     */
    public function storeApplication(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'applicant_name' => ['required', 'string', 'max:255'],
            'applicant_phone' => ['required', 'string', 'min:9', 'max:15'],
            'applicant_email' => ['required', 'email', 'max:255'],
            'bio' => ['required', 'string', 'max:2000'],
            'facebook_url' => ['nullable', 'url'],
            'instagram_url' => ['nullable', 'url'],
            'tiktok_url' => ['nullable', 'url'],
            'photo' => ['nullable', 'image', 'max:2048'],
        ]);

        $category = Category::findOrFail($validated['category_id']);
        $applicationFee = (int)$category->nomination_fee;
        $isFree = $applicationFee <= 0;

        $normalizedPhone = (string) \Illuminate\Support\Str::of($validated['applicant_phone'])
            ->replace(' ', '')
            ->replace('+', '');

        if (!$isFree) {
            if (\Illuminate\Support\Str::startsWith($normalizedPhone, '0')) {
                $normalizedPhone = '255' . substr($normalizedPhone, 1);
            } elseif (strlen($normalizedPhone) === 9 && (\Illuminate\Support\Str::startsWith($normalizedPhone, '7') || \Illuminate\Support\Str::startsWith($normalizedPhone, '6'))) {
                $normalizedPhone = '255' . $normalizedPhone;
            }

            if (!preg_match('/^255[67]\d{8}$/', $normalizedPhone)) {
                return response()->json([
                    'message' => 'Namba ya simu uliyoingiza si sahihi. Tafadhali tumia muundo halali wa Tanzania (mf. 07xxxxxxxx au 06xxxxxxxx).'
                ], 422);
            }
        }

        try {
            $application = DB::transaction(function () use ($request, $validated, $normalizedPhone, $applicationFee, $category, $isFree) {
                $photoPath = $request->hasFile('photo') ? \App\Services\ImageOptimizer::optimizeAndStore($request->file('photo'), 'nominee_photos') : null;

                $app = NomineeApplication::create([
                    'user_id' => $request->user()->id,
                    'category_id' => $validated['category_id'],
                    'applicant_name' => $validated['applicant_name'],
                    'applicant_phone' => $validated['applicant_phone'],
                    'applicant_email' => $validated['applicant_email'],
                    'bio' => $validated['bio'],
                    'facebook_url' => $validated['facebook_url'] ?? null,
                    'instagram_url' => $validated['instagram_url'] ?? null,
                    'tiktok_url' => $validated['tiktok_url'] ?? null,
                    'photo_path' => $photoPath,
                    'status' => $isFree ? 'pending_review' : 'pending_payment',
                ]);

                $transaction = $app->transaction()->create([
                    'user_id' => $request->user()->id,
                    'order_id' => (string) \Illuminate\Support\Str::uuid(),
                    'amount' => $applicationFee,
                    'status' => $isFree ? 'completed' : 'pending',
                    'phone_number' => $normalizedPhone,
                ]);

                if (!$isFree) {
                    // Dispatch background job for ZenoPay payment initiation
                    \App\Jobs\InitiateZenoPayPayment::dispatch($transaction);
                }

                // Send email notification to user
                try {
                    $request->user()->notify(new \App\Notifications\ApplicationSubmitted($app));
                } catch (\Exception $ex) {
                    \Illuminate\Support\Facades\Log::error('Failed to notify application submission', ['error' => $ex->getMessage()]);
                }

                return $app;
            });

            return response()->json([
                'message' => $isFree 
                    ? 'Application submitted successfully. As a free entry, it has been moved directly to review.' 
                    : 'Application submitted successfully. A mobile payment request has been sent to your device.',
                'application' => $application->load(['category:id,name', 'transaction'])
            ], 201);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::critical('Nomination Application API Store Failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'System error occurred while submitting nomination. Please contact secretariat.'
            ], 500);
        }
    }

    /**
     * Get user ticket purchases.
     */
    public function getTickets(Request $request)
    {
        $purchases = TicketPurchase::where('user_id', $request->user()->id)
            ->with(['ticketType:id,name', 'tickets'])
            ->latest()
            ->get();

        return response()->json([
            'purchases' => $purchases
        ]);
    }

    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user = $request->user();
        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'The provided password does not match your current password.',
                'errors' => [
                    'current_password' => ['The provided password does not match your current password.']
                ]
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully.'
        ]);
    }

    /**
     * Retry ZenoPay payment for a nominee application.
     */
    public function retryApplicationPayment(Request $request, NomineeApplication $application)
    {
        if ($application->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($application->status, ['pending_payment', 'payment_failed'])) {
            return response()->json(['message' => 'Cannot retry payment for this application.'], 400);
        }

        $transaction = $application->transaction;
        if (!$transaction) {
            return response()->json(['message' => 'No transaction record found.'], 404);
        }

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($application, $transaction) {
                $application->update(['status' => 'pending_payment']);

                $transaction->update([
                    'status' => 'pending',
                    'notes' => 'Retry payment initiated by user.',
                    'order_id' => (string) \Illuminate\Support\Str::uuid(),
                ]);
            });

            // Dispatch payment job
            \App\Jobs\InitiateZenoPayPayment::dispatch($transaction->fresh());

            return response()->json([
                'message' => 'Payment request successfully sent to your mobile device. Please complete the prompt on your phone.',
                'application' => $application->fresh(['category:id,name', 'transaction'])
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::critical('Payment Retry Failed via API', ['application_id' => $application->id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to initiate payment retry. Please try again later.'], 500);
        }
    }
}
