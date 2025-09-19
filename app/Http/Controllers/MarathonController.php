<?php
namespace App\Http\Controllers;

use function App\Helpers\setting;
use Illuminate\Support\Facades\Log;
use App\Services\ZenoPaymentService;
use App\Models\MarathonRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Transaction;

class MarathonController extends Controller
{
    // Onyesha fomu ya usajili
    public function create()
    {
        return Inertia::render('Marathon/Register', [
            'title' => 'Usajili wa Marathon', // BORESHO: Hakikisha title inatumwa
            'marathonFee' => setting('marathon_fee', 35000), // Pata ada kutoka settings
        ]);
    }

    // Shughulikia usajili na anzisha malipo
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            // BORESHO: Hakikisha email ni ya kipekee kwenye jedwali la marathon, isipokuwa kama ni null
            'email' => 'nullable|email|max:255|unique:marathon_registrations,email',
            // BORESHO: Legeza sheria ili kupokea miundo yote ya namba za Tanzania
            'phone_number' => 'required|string|min:9|max:15',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'tshirt_size' => 'required|in:XS,S,M,L,XL,XXL',
            'race_type' => 'required|in:21km,10km,5km',
            'country' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'emergency_contact_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255', // Ongeza validation kwa address
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:255',
            // ...ongeza validation zingine...
        ], [
            // BORESHO: Ujumbe maalum kwa kosa la email
            'email.unique' => 'Barua pepe hii tayari imeshatumika kusajili mshiriki mwingine.',
        ]);
        
        // BORESHO: Safisha na hakiki namba ya simu iwe katika muundo wa 255...
        $normalizedPhone = (string) Str::of($request->phone_number)
            ->replace(' ', '')
            ->replace('+', '');

        if (Str::startsWith($normalizedPhone, '0')) {
            $normalizedPhone = '255' . substr($normalizedPhone, 1);
        } elseif (strlen($normalizedPhone) === 9 && (Str::startsWith($normalizedPhone, '7') || Str::startsWith($normalizedPhone, '6'))) {
            $normalizedPhone = '255' . $normalizedPhone;
        }

        if (!preg_match('/^255[67]\d{8}$/', $normalizedPhone)) {
            return back()->withErrors(['phone_number' => 'Namba ya simu uliyoingiza si sahihi.'])->withInput();
        }

        // BORESHO: Tumia try-catch block kushughulikia makosa yasiyotarajiwa
        try {
            // 1. Tengeneza usajili na status ya 'pending_payment'
            $registration = MarathonRegistration::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'unique_code' => 'TAPHE25-' . strtoupper(Str::random(6)),
                'status' => 'pending_payment',
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'emergency_contact_relationship' => $request->emergency_contact_relationship,
                'tshirt_size' => $request->tshirt_size,
                'race_type' => $request->race_type,
                'country' => $request->country,
                'region' => $request->region,
            ]);

            Log::info('Marathon Registration Created', ['registration_id' => $registration->id]);

            // 2. Tengeneza transaction inayohusiana na usajili huu
            $marathonFee = (int) setting('marathon_fee', 35000);

            $transaction = $registration->transaction()->create([
                'order_id' => (string) Str::uuid(),
                'amount' => $marathonFee,
                'phone_number' => $normalizedPhone,
                'user_id' => auth()->id(), // BORESHO: Ongeza user_id kama mtumiaji ameingia
                // ================== FIX MUHIMU ==================
                // Hizi fields ni muhimu kwa ZenoPaymentService
                'applicant_name' => $registration->full_name, // Ongeza jina la msajiliwa
                'applicant_email' => $registration->email, // Ongeza email ya msajiliwa
            ]);

            Log::info('Transaction Created for Marathon', [
                'transaction_id' => $transaction->id,
                'order_id' => $transaction->order_id,
                'amount' => $transaction->amount
            ]);

            // 3. Anzisha malipo (STK Push)
            $paymentService = new ZenoPaymentService();
            $response = $paymentService->initiatePayment($transaction);

            if (!$response) {
                Log::error('Marathon Payment Initiation Failed, deleting registration.', ['registration_id' => $registration->id]);
                $registration->delete();
                return Redirect::back()->with('error', 'Imeshindwa kuanzisha malipo. Tafadhali hakikisha namba yako ni sahihi na jaribu tena.');
            }

            $request->session()->put('marathon_order_id', $transaction->order_id);

            // BORESHO: Elekeza kwenye route maalum ya pending payment
            return redirect()->route('marathon.pending', ['order_id' => $transaction->order_id]);

        } catch (\Exception $e) {
            Log::critical('Marathon Registration Failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            // Mrudishie mtumiaji ujumbe wa kirafiki
            return Redirect::back()->with('error', 'Kumetokea tatizo la kiufundi wakati wa usajili. Tafadhali jaribu tena baada ya muda mfupi.');
        }
    }

    // BORESHO: Onyesha ukurasa wa kusubiri malipo
    public function pendingPayment($order_id)
    {
        $transaction = Transaction::where('order_id', $order_id)->firstOrFail();

        // Hakikisha transaction hii ni ya marathon
        abort_if(!($transaction->payable instanceof MarathonRegistration), 404);

        return Inertia::render('Marathon/PendingPayment', [
            'transaction' => $transaction->only('order_id', 'amount', 'phone_number'),
        ]);
    }

    // Ukurasa wa mafanikio baada ya malipo
    public function success(Request $request)
    {
        // Hapa unaweza kupata registration kwa kutumia order_id au session
        $registration = MarathonRegistration::whereHas('transaction', function($q) use ($request) {
            $q->where('order_id', $request->order_id);
        })->firstOrFail();

        // Safisha session baada ya kufanikiwa
        $request->session()->forget('marathon_order_id');

        return Inertia::render('Marathon/RegistrationSuccess', [ // Hii ni faili jipya
            'registration' => $registration->only('full_name', 'unique_code'),
        ]);
    }

    /**
     * BORESHO: Method ya AJAX kwa ajili ya kufuatilia status ya malipo.
     */
    public function checkStatus(Request $request)
    {
        // use App\Models\Transaction; // Hakikisha hii ipo juu ya faili
        $orderId = $request->input('order_id');

        if (!$orderId) {
            return response()->json(['status' => 'error', 'message' => 'Order ID is missing.'], 400);
        }

        $transaction = Transaction::where('order_id', $orderId)->first();

        return $transaction
            ? response()->json(['status' => $transaction->status])
            : response()->json(['status' => 'not_found'], 404);
    }

    /**
     * BORESHO: Onyesha ukurasa wa kuangalia hali ya usajili.
     */
    public function showCheckStatusPage()
    {
        return Inertia::render('Marathon/CheckStatus');
    }

    /**
     * BORESHO: Tafuta usajili wa mtumiaji na umwelekeze kwenye ukurasa sahihi.
     */
    public function findRegistration(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string|min:9|max:15',
        ]);

        // Safisha namba ya simu
        $normalizedPhone = (string) Str::of($validated['phone_number'])
            ->replace(' ', '')->replace('+', '');
        if (Str::startsWith($normalizedPhone, '0')) {
            $normalizedPhone = '255' . substr($normalizedPhone, 1);
        }

        // Tafuta usajili wa hivi karibuni zaidi kwa kutumia namba hiyo
        $registration = MarathonRegistration::where('phone_number', $normalizedPhone)
            ->latest()
            ->first();

        if (!$registration || !$registration->transaction) {
            return back()->withErrors(['phone_number' => 'Hakuna usajili uliopatikana kwa namba hii.'])->withInput();
        }

        // Mwelekeze mtumiaji kulingana na status
        if ($registration->status === MarathonRegistration::STATUS_COMPLETED) {
            return redirect()->route('marathon.success', ['order_id' => $registration->transaction->order_id]);
        }

        if (in_array($registration->status, [MarathonRegistration::STATUS_PENDING_PAYMENT, MarathonRegistration::STATUS_PAYMENT_FAILED])) {
            return redirect()->route('marathon.pending', ['order_id' => $registration->transaction->order_id]);
        }

        return back()->withErrors(['phone_number' => 'Hali ya usajili wako hairuhusu muamala huu.'])->withInput();
    }
}
