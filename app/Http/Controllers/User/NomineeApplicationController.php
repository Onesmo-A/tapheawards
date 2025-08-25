<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\NomineeApplicationResource;
use App\Models\Category;
use App\Models\NomineeApplication;
use App\Models\Setting;
use App\Services\ZenoPaymentService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class NomineeApplicationController extends Controller
{
    /**
     * Display a listing of the user's nominee applications.
     * Hii itakuwa ukurasa wa "Status".
     */
    public function index(Request $request): Response
    {
        $applications = $request->user()->nomineeApplications()->with('category', 'transaction')->latest()->get();

        return Inertia::render('User/Applications/Index', [
            'title' => 'My Applications',
            'applications' => $applications,
            'csrf_token' => csrf_token(), // Ongeza hii
        ]);
    }

    /**
     * Show the form for creating a new nominee application.
     * Hii itakuwa ukurasa wa "Apply".
     */
    public function create(Request $request): Response|RedirectResponse
    {
        // Kagua kama mtumiaji tayari ana maombi yanayosubiri
        $hasPending = Auth::user()->nomineeApplications()
            ->whereIn('status', ['pending_payment', 'pending_review'])
            ->exists();

        if ($hasPending) {
            // Mwelekeze kwenye ukurasa wa status na ujumbe
            return Redirect::route('user.applications.index')
                ->with('warning', 'Tayari una ombi ambalo halijakamilika. Tafadhali kamilisha au subiri lijibiwe.');
        }

        // Ikiwa category_id imechaguliwa kutoka ukurasa wa awali, onyesha fomu
        if ($request->has('category')) {
            $category = Category::findOrFail($request->input('category'));
            $nomination_fee = Setting::where('key', 'nomination_fee')->value('value') ?? 0;

            return Inertia::render('User/Applications/Create', [
                'selectedCategory' => $category,
                'nomination_fee' => (int) $nomination_fee,
                'title' => 'Apply for: ' . $category->name,
            ]);
        }

        // Kama hakuna category iliyochaguliwa, onyesha ukurasa wa kuchagua kategoria
        // TUMEREKEBISHA HAPA: Njia ya view sasa ni 'User/Applications/SelectCategory'
        // Hii itahakikisha inatumia layout sahihi ya dashboard.
        // PIA TUMEREKEBISHA HAPA: 'is_active' imebadilishwa kuwa 'status' = 'active' kulingana na kosa la database.
        // Kama jina la safu yako ni tofauti, badilisha 'status' hapa chini.
        return Inertia::render('User/Applications/SelectCategory', [
            'categories' => Category::where('status', 'active')->get(['id', 'name', 'description']),
            'title' => 'Start Application: Select Category',
        ]);
    }

    /**
     * Store a newly created nominee application in storage.
     */
    public function store(Request $request, ZenoPaymentService $paymentService): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'applicant_name' => 'required|string|max:255',
            'applicant_phone' => 'required|string|regex:/^0[67][1-9]\d{7}$/',
            'applicant_email' => 'required|email|max:255',
            'bio' => 'required|string|min:50|max:2000',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Pata ada ya maombi kutoka kwenye settings
        $fee_value = Setting::where('key', 'nomination_fee')->value('value');
        // Boresha mantiki: Tumia ada ya msingi ikiwa setting haipo, ni null, au ni tupu.
        $nomination_fee = (int) ($fee_value ?: 200);
        $photoPath = $request->file('photo')->store('nominee_photos', 'public');

        // HATUA YA 1: Hifadhi maombi kwanza ndani ya DB Transaction.
        // Hii inahakikisha data ya ombi inahifadhiwa salama kabla ya kujaribu kuwasiliana na ZenoPay.
        try {
            $application = DB::transaction(function () use ($validated, $photoPath, $nomination_fee) {
                return Auth::user()->nomineeApplications()->create([
                    'category_id' => $validated['category_id'],
                    'applicant_name' => $validated['applicant_name'],
                    'applicant_phone' => $validated['applicant_phone'],
                    'applicant_email' => $validated['applicant_email'],
                    'bio' => $validated['bio'],
                    'photo_path' => $photoPath,
                    'status' => $nomination_fee > 0 ? 'pending_payment' : 'pending_review',
                    'nomination_fee' => $nomination_fee,
                ]);
            });
        } catch (\Throwable $th) {
            Log::critical('Database error during nomination submission: ' . $th->getMessage(), ['exception' => $th]);
            return back()->with('error', 'Tumeshindwa kupokea ombi lako. Tafadhali jaribu tena.');
        }

        // Ikiwa hakuna ada, mchakato umekamilika.
        if ($nomination_fee <= 0) {
            return Redirect::route('user.applications.show', $application->id)
                ->with('success', 'Ombi lako limepokelewa na linasubiri mapitio.');
        }

        // HATUA YA 2: Anzisha malipo (kama yanahitajika) BAADA ya kuhifadhi data.
        try {
            $webhookUrl = route('webhooks.zenopay');
            $transaction = $paymentService->initiatePayment(
                $application,
                Auth::user(),
                $nomination_fee,
                $validated['applicant_phone'],
                $webhookUrl
            );

            if (!$transaction) {
                // ZenoPay walijibu na kosa (e.g., invalid API key), lakini ombi letu limehifadhiwa.
                // Sasisha status ya ombi kuwa 'payment_failed'.
                $application->update(['status' => 'payment_failed']);
                return Redirect::route('user.applications.show', $application->id)
                    ->with('error', 'Tumeshindwa kuanzisha malipo. Tafadhali jaribu tena au wasiliana na msaada.');
            }

            // Malipo yameanzishwa, mwelekeze mtumiaji kwenye ukurasa wa status.
            return Redirect::route('user.applications.show', $application->id)
                ->with('success', 'Ombi lako limepokelewa. Tafadhali thibitisha malipo kwenye simu yako.');

        } catch (ConnectionException $e) {
            // Kosa la mtandao. Ombi limehifadhiwa, lakini malipo hayajaanza.
            // Cron job itashughulikia hili baadaye.
            Log::warning('ZenoPay Connection Error after submission: ' . $e->getMessage(), ['application_id' => $application->id]);
            return Redirect::route('user.applications.show', $application->id)
                ->with('warning', 'Ombi lako limehifadhiwa, lakini imeshindikana kuwasiliana na mtandao wa malipo. Tutajaribu tena kiotomatiki.');
        } catch (\Throwable $th) {
            // Kosa lingine lisilotegemewa wakati wa kuanzisha malipo.
            Log::critical('An unexpected error occurred during payment initiation: ' . $th->getMessage(), ['exception' => $th, 'application_id' => $application->id]);
            $application->update(['status' => 'payment_failed']);
            return Redirect::route('user.applications.show', $application->id)
                ->with('error', 'Kosa la kiufundi limetokea wakati wa kuanzisha malipo. Tafadhali jaribu tena.');
        }
    }

    /**
     * Display the specified application status.
     */
    public function show(NomineeApplication $application)
    {
        // Hakikisha mtumiaji anayeangalia status ndiye mmiliki wa ombi
        if ($application->user_id !== Auth::id()) {
            abort(403, 'This action is unauthorized.');
        }

        // Load transaction relationship
        $application->load(['transaction', 'category']);

        return Inertia::render('User/Applications/Show', [
            'application' => new NomineeApplicationResource($application),
            'title' => 'Application Status: ' . $application->applicant_name,
        ]);
    }

    /**
     * Re-initiate the payment process for an application.
     */
    public function retryPayment(Request $request, NomineeApplication $application, ZenoPaymentService $paymentService): RedirectResponse
    {
        // 1. Usalama: Hakikisha mtumiaji ndiye mmiliki na ombi liko kwenye status sahihi
        if ($application->user_id !== Auth::id()) {
            abort(403, 'This action is unauthorized.');
        }

        if (!in_array($application->status, ['pending_payment', 'payment_failed'])) {
            return back()->with('error', 'This application is not awaiting payment.');
        }

        // 2. Anzisha upya malipo
        try {
            $webhookUrl = route('webhooks.zenopay');
            $transaction = $paymentService->initiatePayment(
                $application,
                Auth::user(),
                $application->nomination_fee,
                $application->applicant_phone, // Tumia namba iliyohifadhiwa
                $webhookUrl
            );

            if (!$transaction) {
                return back()->with('error', 'We could not re-initiate the payment. Please contact support.');
            }

            // Hakikisha status inarudi kuwa 'pending_payment'
            $application->update(['status' => 'pending_payment']);

            return back()->with('success', 'A new payment request has been sent to your phone.');

        } catch (ConnectionException $e) {
            Log::warning('ZenoPay Connection Error during payment retry', ['application_id' => $application->id, 'error' => $e->getMessage()]);
            return back()->with('warning', 'Could not connect to the payment service. Please try again in a few moments.');
        } catch (\Throwable $th) {
            Log::critical('Unexpected error during payment retry', ['application_id' => $application->id, 'exception' => $th]);
            return back()->with('error', 'A technical error occurred. Please contact support.');
        }
    }
}