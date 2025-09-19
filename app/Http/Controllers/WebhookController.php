<?php

namespace App\Http\Controllers;

use App\Models\NomineeApplication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\MarathonRegistration; // BORESHO: Ongeza MarathonRegistration model
use App\Mail\MarathonPaymentCompleted;
use App\Mail\MarathonPaymentFailed;
use App\Mail\NomineePaymentCompleted;
use App\Mail\NomineePaymentFailed;
use App\Notifications\NewMarathonRegistration; // BORESHO: Ongeza Notification ya Marathon

class WebhookController extends Controller
{
    /**
     * Pokea na shughulikia majibu ya malipo kutoka ZenoPay.
     */
    public function handleZenoPay(Request $request)
    {
        // Log ya awali kabisa kuthibitisha ombi limefika, na tunaweka payload yote
        Log::info('ZenoPay Webhook: Endpoint Hit.', [
            'ip' => $request->ip(),
            'headers' => $request->headers->all(), // Log headers zote kwa ajili ya uchunguzi
            'payload' => $request->all()
        ]);

        try {
            // ================== USALAMA WA WEBHOOK (HYBRID: API Key + IP Whitelist) ==================
            // Kwa kuwa ZenoPay hawatumi API Key kwenye webhook, tunatumia IP Whitelisting kama njia kuu ya usalama.
            // Pia tunaiacha code ya API Key kwa ajili ya siku za usoni kama wataanza kuituma.
            $zenoApiKey = config('services.zenopay.key');
            $receivedApiKey = $request->header('x-api-key') ?? $request->header('HTTP_X_API_KEY');

            $isApiKeyValid = $receivedApiKey && hash_equals((string) $zenoApiKey, (string) $receivedApiKey);

            $allowedIps = explode(',', config('services.zenopay.ips', ''));
            $requestIp = $request->ip();
            $isIpAllowed = in_array($requestIp, $allowedIps);

            if ($isApiKeyValid) {
                $authMethod = 'API Key';
            } elseif ($isIpAllowed) {
                $authMethod = 'IP Whitelist';
                Log::info('ZenoPay Webhook: Authenticated via IP Whitelist (API Key was missing/invalid).', ['ip' => $requestIp]); // Hii ni logi salama
            } else {
                Log::critical('ZenoPay Webhook: UNAUTHORIZED ATTEMPT - Both API Key and IP Whitelist checks failed.', [
                    'ip' => $request->ip(),
                    'received_key' => $receivedApiKey,
                ]);
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }

            $payload = $request->all();
            Log::info('ZenoPay Webhook: Received and Authenticated via ' . $authMethod, ['payload' => $payload]);

            $orderId = $payload['order_id'] ?? null;
            $status = $payload['payment_status'] ?? null;

            if (!$orderId || !$status) {
                Log::warning('ZenoPay Webhook: Missing required parameters.', ['payload' => $payload]);
                return response()->json(['status' => 'error', 'message' => 'Missing parameters'], 400);
            }

            // 2. Pata transaction yetu kwa kutumia order_id
            Log::info('ZenoPay Webhook: Searching for transaction.', ['order_id' => $orderId]);
            $transaction = Transaction::where('order_id', $orderId)->first();

            if (!$transaction) {
                Log::error('ZenoPay Webhook: Transaction not found.', ['order_id' => $orderId]);
                return response()->json(['status' => 'success', 'message' => 'Transaction not found but acknowledged']);
            }
            // 3. Zuia kusasisha transaction ambayo haiko 'pending'
            // BORESHO: Tumia constant badala ya 'hardcoded string'
            if ($transaction->status !== Transaction::STATUS_PENDING) {
                Log::info('ZenoPay Webhook: Transaction already processed, ignoring.', ['order_id' => $orderId, 'current_status' => $transaction->status]);
                return response()->json(['status' => 'success', 'message' => 'Already processed']);
            }

            Log::info('ZenoPay Webhook: Transaction found and is pending. Proceeding to update.', ['transaction_id' => $transaction->id, 'order_id' => $orderId]);
            // 4. Tumia DB Transaction kuhakikisha data inakuwa sahihi (atomicity)
            DB::transaction(function () use ($transaction, $status, $payload) {
                // BORESHO: Tumia constants kwa usahihi na usalama
                if ($status === 'COMPLETED') {
                    $transaction->update([
                        'status' => Transaction::STATUS_COMPLETED,
                        'gateway_reference' => $payload['reference'] ?? ($payload['transid'] ?? null),
                        'payment_method' => $payload['channel'] ?? null,
                        'notes' => 'Webhook: Payment completed successfully.',
                    ]);

                    // BORESHO: Tambua aina ya malipo (Marathon au Nominee Application) na sasisha status ipasavyo
                    if ($transaction->payable instanceof MarathonRegistration) {
                        $transaction->payable->update(['status' => MarathonRegistration::STATUS_COMPLETED]);
                        Log::info('ZenoPay Webhook: DB Update - Marathon Registration status updated to COMPLETED.', ['order_id' => $transaction->order_id, 'registration_id' => $transaction->payable_id]);
                        // Tuma barua pepe kwa mshiriki
                        if ($transaction->payable->email) {
                            \Illuminate\Support\Facades\Mail::to($transaction->payable->email)->queue(new MarathonPaymentCompleted($transaction->payable));
                        }
                        // Tuma barua pepe kwa admin
                        User::where('is_admin', true)->first()?->notify(new NewMarathonRegistration($transaction->payable));
                    } elseif ($transaction->payable instanceof NomineeApplication) {
                        $transaction->payable->update(['status' => NomineeApplication::STATUS_PENDING_REVIEW]);
                        // Tuma barua pepe kwa mwombaji
                        \Illuminate\Support\Facades\Mail::to($transaction->payable->applicant_email)->queue(new NomineePaymentCompleted($transaction->payable));
                        Log::info('ZenoPay Webhook: DB Update - Nominee Application status updated to PENDING_REVIEW.', ['order_id' => $transaction->order_id, 'application_id' => $transaction->payable_id]);
                    }

                } elseif ($status === 'FAILED') {
                    $transaction->update([
                        'status' => Transaction::STATUS_FAILED,
                        'notes' => 'Webhook: Payment failed. Reason: ' . ($payload['message'] ?? 'Unknown'),
                    ]);
                    // BORESHO: Sasisha status ya 'failed' kwa model husika
                    $statusField = ($transaction->payable instanceof MarathonRegistration) ? MarathonRegistration::STATUS_PAYMENT_FAILED : NomineeApplication::STATUS_PAYMENT_FAILED;
                    if ($transaction->payable) {
                        $transaction->payable->update(['status' => $statusField]);
                        // Tuma barua pepe ya malipo yaliyoshindikana
                        if ($transaction->payable instanceof MarathonRegistration && $transaction->payable->email) {
                            \Illuminate\Support\Facades\Mail::to($transaction->payable->email)->queue(new MarathonPaymentFailed($transaction->payable));
                        } elseif ($transaction->payable instanceof NomineeApplication) {
                            \Illuminate\Support\Facades\Mail::to($transaction->payable->applicant_email)->queue(new NomineePaymentFailed($transaction->payable));
                        }
                    }
                    Log::info('ZenoPay Webhook: DB Update - Payable status updated to FAILED.', ['order_id' => $transaction->order_id, 'payable_id' => $transaction->payable_id]);
                }
            });
            Log::info('ZenoPay Webhook: Process completed successfully. Sending 200 OK response.', ['order_id' => $orderId]);
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