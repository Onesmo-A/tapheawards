<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\ZenoPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Pokea na shughulikia majibu ya malipo kutoka ZenoPay.
     */
    public function handleZenoPay(Request $request, ZenoPaymentService $paymentService)
    {
        // 1. USALAMA KWANZA: Hakikisha request imetoka ZenoPay kweli
        if (!$paymentService->isWebhookAuthentic($request)) {
            Log::critical('ZenoPay Webhook: UNAUTHORIZED ATTEMPT.', ['ip' => $request->ip()]);
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $payload = $request->all();
        Log::info('ZenoPay Webhook Received:', $payload);

        $orderId = $payload['order_id'] ?? null;
        $status = $payload['payment_status'] ?? null;

        if (!$orderId || !$status) {
            Log::warning('ZenoPay Webhook: Missing required parameters.', ['payload' => $payload]);
            return response()->json(['status' => 'error', 'message' => 'Missing parameters'], 400);
        }

        // 2. Pata transaction yetu kwa kutumia order_id
        $transaction = Transaction::where('order_id', $orderId)->first();

        if (!$transaction) {
            Log::error('ZenoPay Webhook: Transaction not found.', ['order_id' => $orderId]);
            // Jibu success ili Zeno wasiendelee kutuma webhook hii
            return response()->json(['status' => 'success', 'message' => 'Transaction not found but acknowledged']);
        }

        // 3. Sasisha status ikiwa malipo yamekamilika na transaction ilikuwa bado inasubiri
        if ($transaction->status === 'pending' && $status === 'COMPLETED') {
            $transaction->update([
                'status' => 'completed',
                'gateway_reference' => $payload['reference'] ?? ($payload['transid'] ?? null),
                'payment_method' => $payload['channel'] ?? null,
                'notes' => 'Webhook received successfully.',
            ]);

            // Sasisha na status ya ombi husika (NomineeApplication)
            $application = $transaction->payable;
            $application?->update(['status' => 'pending_review']);
        }

        // 4. Jibu ZenoPay kwamba umepokea taarifa yao
        return response()->json(['status' => 'success']);
    }
}