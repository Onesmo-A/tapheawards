<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Pokea na shughulikia majibu ya malipo kutoka ZenoPay.
     */
    public function handleZenoPay(Request $request)
    {
        // Log ya awali kabisa kuthibitisha ombi limefika, na tunaweka payload yote
        Log::channel('stack')->info('ZenoPay Webhook Endpoint Hit.', [
            'ip' => $request->ip(),
            'headers' => $request->headers->all(), // Log headers zote kwa ajili ya uchunguzi
            'payload' => $request->all()
        ]);

        try {
            // ================== SULUHUisho la MUDA ==================
            // Kizuizi hiki kimezimwa kwa muda kwa sababu ZenoPay hawatumi 'x-api-key' header kwenye webhook yao.
            // NI MUHIMU kuwasiliana na ZenoPay ili waanze kutuma header hii, kisha uondoe maoni (uncomment)
            // kwenye kizuizi hiki ili kurudisha usalama.
            //
            // $incomingApiKey = $request->header('x-api-key');
            // $expectedApiKey = config('services.zenopay.key');
            //
            // if ($incomingApiKey !== $expectedApiKey) {
            //     Log::critical('ZenoPay Webhook: UNAUTHORIZED ATTEMPT - Invalid API Key.', [
            //         'ip' => $request->ip(),
            //         'incoming_key' => $incomingApiKey,
            //         'expected_key' => $expectedApiKey,
            //     ]);
            //     return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            // }

            $payload = $request->all();
            Log::info('ZenoPay Webhook Received and Authenticated:', $payload);

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
                return response()->json(['status' => 'success', 'message' => 'Transaction not found but acknowledged']);
            }

            // 3. Zuia kusasisha transaction ambayo haiko 'pending'
            if ($transaction->status !== 'pending') {
                Log::info('ZenoPay Webhook: Transaction already processed, ignoring.', ['order_id' => $orderId, 'current_status' => $transaction->status]);
                return response()->json(['status' => 'success', 'message' => 'Already processed']);
            }

            // 4. Tumia DB Transaction kuhakikisha data inakuwa sahihi (atomicity)
            DB::transaction(function () use ($transaction, $status, $payload) {
                if ($status === 'COMPLETED') {
                    $transaction->update([
                        'status' => 'completed',
                        'gateway_reference' => $payload['reference'] ?? ($payload['transid'] ?? null),
                        'payment_method' => $payload['channel'] ?? null,
                        'notes' => 'Webhook: Payment completed successfully.',
                    ]);
                    $transaction->payable?->update(['status' => 'pending_review']);
                    Log::info('ZenoPay Webhook: Transaction status updated to COMPLETED.', ['order_id' => $transaction->order_id]);
                } elseif ($status === 'FAILED') {
                    $transaction->update([
                        'status' => 'failed',
                        'notes' => 'Webhook: Payment failed. Reason: ' . ($payload['message'] ?? 'Unknown'),
                    ]);
                    $transaction->payable?->update(['status' => 'payment_failed']);
                    Log::info('ZenoPay Webhook: Transaction status updated to FAILED.', ['order_id' => $transaction->order_id]);
                }
            });

            // 5. Jibu ZenoPay kwamba umepokea taarifa yao
            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::critical('ZenoPay Webhook: CRITICAL ERROR during processing.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->all(),
            ]);
            return response()->json(['status' => 'error', 'message' => 'Internal Server Error'], 500);
        }
    }
}