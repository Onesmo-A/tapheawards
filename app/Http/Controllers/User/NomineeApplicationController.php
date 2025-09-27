<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use App\Models\NomineeApplication; // BORESHO: Ongeza notisi mpya
use App\Notifications\NewNomineeApplication;
use App\Jobs\InitiateZenoPayPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Notifications\ApplicationSubmitted;
use Inertia\Response as InertiaResponse;

class NomineeApplicationController extends Controller
{
    public function index()
    {
        $applications = auth()->user()->nomineeApplications()
            ->has('category') // ONGEZA: Hakikisha maombi yana kategoria halali kabla ya kuyaonyesha
            ->with(['category:id,name', 'transaction']) // ONGEZA: Pakia 'transaction' ili data ya malipo ipatikane
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Hatua ya 1: Onyesha ukurasa wa kuchagua kategoria.
     * Hii inaitwa na route 'user.applications.selectCategory'.
     */
    public function selectCategory(): InertiaResponse
    {
        // 1. Tumia Policy kuzuia mtumiaji kuanza ombi jipya kama tayari ana ombi linaloendelea.
        // Hii inazuia maombi mengi kwa wakati mmoja.
        Gate::authorize('create', NomineeApplication::class);

        // 2. Pata makundi makuu ya tuzo (yale hayana parent_id).
        // Kisha, kwa kila kundi, pakia 'children' (tuzo zenyewe) ambazo
        // zinaruhusu maombi (`status` = 'active').
        $categoryGroups = Category::query()
            ->whereNull('parent_id')
            ->with(['children' => function ($query) {
                // Chuja watoto (tuzo) ili zibaki zile tu zinazopokea maombi
                $query->where('status', 'active')->orderBy('name');
            }])
            // Chuja makundi makuu ili yabaki yale tu yenye tuzo zinazopokea maombi
            ->whereHas('children', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        // 3. Tuma data kwenda kwenye Vue component.
        return Inertia::render('User/Applications/SelectCategory', [
            'categoryGroups' => $categoryGroups,
        ]);
    }

    /**
     * Hatua ya 2: Onyesha fomu ya kujaza kwa kategoria maalum.
     * Hii inaitwa na route 'user.applications.create'.
     */
    public function create(Category $category): InertiaResponse
    {
        return Inertia::render('User/Applications/Create', [
            'title' => 'Jaza Fomu: ' . $category->name,
            'selectedCategory' => $category,
            // BORESHO: Pata ada kutoka kwenye kategoria husika badala ya config file.
            'nomination_fee' => (int) $category->nomination_fee,
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'applicant_name' => 'required|string|max:255',
            // Legeza sheria ya awali ili kupokea miundo mbalimbali ya namba
            'applicant_phone' => 'required|string|min:9|max:15',
            'applicant_email' => 'required|email|max:255',
            'bio' => 'required|string|max:2000',
            'photo' => 'nullable|image|max:2048',
        ]);

        // Safisha na hakiki namba ya simu iwe katika muundo wa 255...
        $normalizedPhone = (string) Str::of($validated['applicant_phone'])
            ->replace(' ', '')
            ->replace('+', '');

        if (Str::startsWith($normalizedPhone, '0')) {
            $normalizedPhone = '255' . substr($normalizedPhone, 1);
        } elseif (strlen($normalizedPhone) === 9 && (Str::startsWith($normalizedPhone, '7') || Str::startsWith($normalizedPhone, '6'))) {
            $normalizedPhone = '255' . $normalizedPhone;
        }

        // Baada ya kuisafisha, hakiki tena kama iko sahihi kabla ya kuendelea
        if (!preg_match('/^255[67]\d{8}$/', $normalizedPhone)) {
            // Rudisha kosa maalum la namba ya simu ambalo litaonekana kwenye fomu
            return back()->withErrors([
                'applicant_phone' => 'Namba ya simu uliyoingiza si sahihi. Tafadhali tumia muundo halali wa Tanzania.'
            ])->withInput();
        }

        // REKEBISHO: Pata kategoria na ada yake kutoka kwenye database
        $category = Category::findOrFail($validated['category_id']);
        $applicationFee = $category->nomination_fee;

        $application = null;

        try {
            $application = DB::transaction(function () use ($request, $validated, $normalizedPhone, $applicationFee, $category) {
                $photoPath = $request->hasFile('photo') ? $request->file('photo')->store('nominee_photos', 'public') : null;

                $application = NomineeApplication::create([
                    'user_id' => $request->user()->id,
                    'category_id' => $validated['category_id'],
                    'applicant_name' => $validated['applicant_name'],
                    // Hifadhi namba halisi aliyoingiza mtumiaji kwenye application
                    'applicant_phone' => $validated['applicant_phone'],
                    'applicant_email' => $validated['applicant_email'],
                    'bio' => $validated['bio'],
                    'photo_path' => $photoPath,
                    'status' => 'pending_payment',
                ]);

                $application->transaction()->create([
                    'user_id' => $request->user()->id,
                    'order_id' => (string) Str::uuid(),
                    'amount' => $applicationFee,
                    'status' => 'pending',
                    // Tumia namba iliyosafishwa kwa ajili ya muamala wa malipo
                    'phone_number' => $normalizedPhone,
                ]);

                // Dispatch the job to handle payment initiation in the background
                InitiateZenoPayPayment::dispatch($application->transaction);

                // BORESHO: Tuma notisi kwa mwombaji kumjulisha ombi limepokelewa
                try {
                    $request->user()->notify(new ApplicationSubmitted($application));
                } catch (\Exception $e) {
                    // Log kosa la kutuma email kwa mwombaji bila kumzuia
                    Log::error('Failed to send application submitted notification to user.', 
                        ['user_id' => $request->user()->id, 'application_id' => $application->id, 'error' => $e->getMessage()]);
                }

                return $application;
            });

            return redirect()->route('user.applications.show', $application->id)->with('success', 'Ombi lako limepokelewa. Tafadhali subiri ujumbe wa malipo kwenye simu yako.');

        } catch (\Exception $e) {
            Log::critical('Nomination Application Store Failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Kumetokea tatizo la kiufundi. Tafadhali wasiliana na wasaidizi.');
        }
    }

    public function show(NomineeApplication $application): InertiaResponse
    {
        $this->authorize('view', $application);
    
        // Pakia mahusiano (relationships) muhimu
        $application->load(['category:id,name', 'transaction']);
    
        // BORESHO: Kagua kama kategoria ya ombi hili bado ipo.
        // Kama haipo, huenda ilifutwa. Ni bora kumrudisha mtumiaji na ujumbe.
        if (!$application->category) {
            return redirect()->route('user.applications.index')
                ->with('error', 'Samahani, kategoria ya ombi ulilochagua haipatikani tena.');
        }
    
        return Inertia::render('User/Applications/Show', [
            'application' => $application,
        ]);
    }

    public function retryPayment(NomineeApplication $application): \Illuminate\Http\RedirectResponse
    {
        // REKEBISHO: Tumia policy sahihi ya 'retryPayment' badala ya 'update'.
        $this->authorize('retryPayment', $application);

        if (!in_array($application->status, ['pending_payment', 'payment_failed'])) {
            return back()->with('error', 'Huwezi kujaribu kulipia ombi hili.');
        }

        $transaction = $application->transaction;
        if (!$transaction) {
            return back()->with('error', 'Hakuna taarifa za muamala kwa ombi hili.');
        }

        try {
            // BORESHO: Tengeneza order_id mpya kabla ya kutuma ombi la malipo.
            // Hii inazuia kutumia order_id ya zamani na inahakikisha kila jaribio la malipo ni la kipekee.
            DB::transaction(function () use ($application, $transaction) {
                $application->update(['status' => 'pending_payment']);

                $transaction->update([
                    'status' => 'pending',
                    'notes' => 'Retry payment initiated by user.',
                    // Tengeneza Order ID mpya kwa ajili ya jaribio hili jipya
                    'order_id' => (string) Str::uuid(),
                ]);
            });

            // Tuma kazi (job) na taarifa mpya za muamala
            InitiateZenoPayPayment::dispatch($transaction->fresh());

            return redirect()->route('user.applications.show', $application->id)->with('success', 'Ombi jipya la malipo limetumwa. Tafadhali kamilisha kwenye simu yako.');
        } catch (\Exception $e) {
            Log::critical('Payment Retry Failed', ['application_id' => $application->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Imeshindikana kuanzisha malipo tena. Tafadhali jaribu baada ya muda mfupi.');
        }
    }
}