<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\TicketPurchase;
use Illuminate\Http\JsonResponse;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Services\ZenoPaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;
// use SimpleSoftwareIO\QrCode\Facades\QrCode;

        // Kwa hii (force GD backend):
use SimpleSoftwareIO\QrCode\Facades\QrCode;


class TicketController extends Controller
{
    /**
     * Onyesha ukurasa wa kuchagua aina ya tiketi.
     */
    public function index(): Response
    {
        $ticketTypes = TicketType::where('is_active', true)
            ->orderBy('price')
            ->get();

        return Inertia::render('Tickets/Index', [
            'title' => 'Nunua Tiketi za Tuzo',
            'description' => 'Chagua aina ya tiketi na uwe sehemu ya usiku wa kihistoria wa kutambua mashujaa wa afya nchini.',
            'ticketTypes' => $ticketTypes,
        ]);
    }

    /**
     * Onyesha fomu ya kununua tiketi kwa aina maalum.
     */
    public function showPurchaseForm(Request $request): Response|RedirectResponse
    {
        $request->validate(['ticket_type_id' => 'required|exists:ticket_types,id']);

        $ticketType = TicketType::findOrFail($request->ticket_type_id);

        // Kama mtumiaji ameingia, jaza fomu na taarifa zake
        $user = Auth::user();

        return Inertia::render('Tickets/PurchaseForm', [
            'title' => 'Nunua Tiketi: ' . $ticketType->name,
            'ticketType' => $ticketType,
            'auth' => [
                'user' => $user ? [
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
        ]);
    }

    /**
     * Shughulikia ununuzi na anzisha malipo.
     */
    public function processPurchase(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ticket_type_id' => 'required|exists:ticket_types,id',
            'purchaser_name' => 'required|string|max:255',
            'purchaser_email' => 'required|email|max:255',
            'purchaser_phone' => 'required|string|min:9|max:15',
            'quantity' => 'required|integer|min:1|max:100', // Weka ukomo wa juu
        ]);

        $ticketType = TicketType::findOrFail($validated['ticket_type_id']);
        $totalAmount = $ticketType->price * $validated['quantity'];

        // Safisha namba ya simu iwe katika muundo wa 255...
        $normalizedPhone = (string) Str::of($validated['purchaser_phone'])
            ->replace(' ', '')
            ->replace('+', '');

        if (Str::startsWith($normalizedPhone, '0')) {
            $normalizedPhone = '255' . substr($normalizedPhone, 1);
        } elseif (strlen($normalizedPhone) === 9 && (Str::startsWith($normalizedPhone, '7') || Str::startsWith($normalizedPhone, '6'))) {
            $normalizedPhone = '255' . $normalizedPhone;
        }

        if (!preg_match('/^255[67]\d{8}$/', $normalizedPhone)) {
            return back()->withErrors(['purchaser_phone' => 'Namba ya simu uliyoingiza si sahihi.'])->withInput();
        }

        try {
            $purchase = DB::transaction(function () use ($validated, $ticketType, $totalAmount, $normalizedPhone) {
                // 1. Tengeneza rekodi ya ununuzi
                $ticketPurchase = TicketPurchase::create([
                    'user_id' => Auth::id(),
                    'ticket_type_id' => $ticketType->id,
                    'purchaser_name' => $validated['purchaser_name'],
                    'purchaser_email' => $validated['purchaser_email'],
                    'purchaser_phone' => $validated['purchaser_phone'], // Hifadhi namba asilia
                    'quantity' => $validated['quantity'],
                    'total_amount' => $totalAmount,
                    'status' => TicketPurchase::STATUS_PENDING_PAYMENT,
                ]);

                Log::info('Ticket Purchase record created.', ['purchase_id' => $ticketPurchase->id]);

                // 2. Tengeneza transaction inayohusiana na ununuzi huu
                $transaction = $ticketPurchase->transaction()->create([
                    'order_id' => (string) Str::uuid(),
                    'amount' => $totalAmount,
                    'phone_number' => $normalizedPhone, // Tumia namba iliyosafishwa kwa malipo
                    'user_id' => Auth::id(),
                ]);

                // 3. BORESHO MUHIMU: Hifadhi transaction_id kwenye rekodi ya ununuzi
                // Hii inatengeneza uhusiano wa moja kwa moja kati ya ununuzi na muamala wake.
                $ticketPurchase->transaction_id = $transaction->id;
                $ticketPurchase->save();

                Log::info('Transaction created for Ticket Purchase.', [
                    'transaction_id' => $transaction->id,
                    'order_id' => $transaction->order_id,
                    'purchase_id' => $ticketPurchase->id,
                ]);

                // 4. Anzisha malipo (STK Push)
                $paymentService = new ZenoPaymentService();
                $response = $paymentService->initiatePayment($transaction);

                if (!$response) {
                    // Tupa exception ili transaction iwe rolled back
                    throw new \Exception('Failed to initiate payment via ZenoPaymentService.');
                }

                return $ticketPurchase;
            });

            // Elekeza kwenye ukurasa wa kusubiri malipo
            // REKEBISHO: Pata 'order_id' kutoka kwenye transaction iliyohifadhiwa
            // Tunatumia 'mainTransaction' relationship tuliyotengeneza.
            $orderId = $purchase->fresh()->mainTransaction->order_id;
            return Redirect::route('tickets.pending', ['order_id' => $orderId]);

        } catch (Throwable $e) {
            Log::critical('Ticket Purchase Processing Failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            // BORESHO: Toa ujumbe maalum kwa mtumiaji kulingana na aina ya kosa.
            $errorMessage = 'Kumetokea tatizo la kiufundi. Tafadhali jaribu tena baada ya muda mfupi.';
            if (str_contains($e->getMessage(), 'ZenoPaymentService')) {
                $errorMessage = 'Imeshindwa kuanzisha malipo. Tafadhali hakikisha namba yako ya simu ni sahihi na jaribu tena.';
            }

            return Redirect::back()->with('error', $errorMessage)->withInput();
        }
    }

    /**
     * Onyesha ukurasa wa kusubiri uthibitisho wa malipo.
     */
    public function pendingPayment(string $order_id): Response
    {
        $transaction = Transaction::where('order_id', $order_id)
            ->where('payable_type', TicketPurchase::class)
            ->firstOrFail();

        return Inertia::render('Tickets/PendingPayment', [
            'title' => 'Subiri Uthibitisho wa Malipo',
            'transaction' => $transaction->only('order_id', 'amount', 'phone_number'),
        ]);
    }

    /**
     * Onyesha ukurasa wa mafanikio baada ya malipo.
     */
    public function success(string $order_id): Response
    {
        $purchase = TicketPurchase::whereHas('transaction', function ($query) use ($order_id) {
            $query->where('order_id', $order_id)
                  ->where('status', Transaction::STATUS_COMPLETED); // Hakikisha muamala umekamilika
        })
        // BORESHO: Pakia uhusiano wa 'transaction' ili data yake ipatikane kwenye view.
        ->with(['ticketType', 'tickets', 'transaction']) // REKEBISHO: Tumia 'ticketType' (camelCase) kama ilivyo kwenye Model
        ->where('status', TicketPurchase::STATUS_COMPLETED)
        ->firstOrFail();


        return Inertia::render('Tickets/Success', [
            'title' => 'Malipo Yamefanikiwa!',
            'purchase' => $purchase,
        ]);
    }

    /**
     * Endpoint ya AJAX kwa ajili ya kufuatilia status ya malipo.
     */
    public function checkStatus(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate(['order_id' => 'required|string|exists:transactions,order_id']);

        $transaction = Transaction::where('order_id', $validated['order_id'])->first();

        // Angalia kama malipo yamekamilika na ni ya ununuzi wa tiketi
        if ($transaction->status === Transaction::STATUS_COMPLETED && $transaction->payable_type === TicketPurchase::class) {
            // Pata ununuzi husika
            $purchase = TicketPurchase::find($transaction->payable_id);

            // Hakikisha status ya ununuzi pia ni 'completed'
            if ($purchase && $purchase->status === TicketPurchase::STATUS_COMPLETED) {
                return response()->json([
                    'status' => 'completed',
                    'redirect_url' => route('tickets.success', ['order_id' => $transaction->order_id])
                ]);
            }
        }

        return response()->json(['status' => $transaction->status]);
    }

    /**
     * Pakua tiketi kama PDF.
     */
public function downloadPdf(string $order_id)
{
    $purchase = TicketPurchase::whereHas('transaction', function ($query) use ($order_id) {
        $query->where('order_id', $order_id);
    })
    ->where('status', TicketPurchase::STATUS_COMPLETED)
    ->with(['ticketType', 'tickets', 'transaction'])
    ->with(['ticketType', 'tickets', 'mainTransaction'])
    ->firstOrFail();

    // BORESHO: Angalia kama 'imagick' inapatikana na imesanidiwa, la sivyo tumia 'gd'.
    // Hii inafanya programu iweze kufanya kazi kwenye mazingira tofauti (local na live).
    if (extension_loaded('imagick') && config('qrcode.renderer') === 'imagick') {
        // Tumia 'imagick' kama inavyotakiwa
        $qrCodeGenerator = QrCode::format('png');
    } else {
        // Kama 'imagick' haipo, lazimisha matumizi ya 'gd'
        Log::warning('Imagick extension not found or not configured. Falling back to GD for QR Code generation.');
        $qrCodeGenerator = QrCode::format('png')->renderer('gd');
    }

    // BORESHO: Tengeneza QR code kwa kila tiketi, sio kwa ununuzi mzima.
    // Hii inahakikisha kila tiketi inaweza kuskaniwa kivyake.
    $qrCodes = [];
    foreach ($purchase->tickets as $ticket) {
        $qrCodes[$ticket->id] = base64_encode(
            $qrCodeGenerator
                ->size(200) // Punguza ukubwa kidogo ili zitoshe vizuri
                ->errorCorrection('H') // Ongeza uwezo wa kusomeka hata zikichafuka kidogo
                ->generate($ticket->ticket_code) // Tumia TICKET_CODE, sio Order ID
        );
    }

    // BORESHO: Pata nembo ya mfadhili mkuu
    $mainSponsorLogo = null;
    $mainSponsorPath = public_path('images/sponsors/main-sponsor.png');
    if (file_exists($mainSponsorPath)) {
        $type = pathinfo($mainSponsorPath, PATHINFO_EXTENSION);
        $data = file_get_contents($mainSponsorPath);
        $mainSponsorLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    // BORESHO: Pata nembo za wafadhili wengine
    $otherSponsorLogos = [];
    $sponsorDir = public_path('images/sponsors');
    if (is_dir($sponsorDir)) {
        // BORESHO: Pata faili zote za picha na uiondoe ya mfadhili mkuu.
        $allSponsorFiles = glob($sponsorDir . '/*.{png,jpg,jpeg,svg}', GLOB_BRACE);
        foreach ($allSponsorFiles as $file) {
            if (basename($file) !== 'main-sponsor.png') {
                $type = pathinfo($file, PATHINFO_EXTENSION);
                $data = file_get_contents($file);
                $otherSponsorLogos[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        }
    }

    $pdf = Pdf::loadView('pdf.tickets', [
        'purchase' => $purchase,
        // REKEBISHO: Tuma array nzima ya QR codes kwenda kwenye view ili zote zionyeshwe.
        'qrCodes' => $qrCodes,
        'mainSponsorLogo' => $mainSponsorLogo,
        'otherSponsorLogos' => $otherSponsorLogos,
    ]);

    return $pdf->download('TAPHE-Awards-Tickets.pdf');
}

}
