<?php

namespace App\Http\Controllers;
use App\Mail\TicketPaymentCompleted;
use App\Models\TicketPurchase;

use App\Models\NomineeApplication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Notifications\NewTicketPurchase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\MarathonRegistration; // BORESHO: Ongeza MarathonRegistration model
use App\Mail\MarathonPaymentCompleted;
use App\Mail\MarathonPaymentFailed;
use App\Mail\NomineePaymentCompleted;
use App\Mail\NomineePaymentFailed;
use App\Notifications\NewNomineeApplication;
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
        // 4. Tumia processWebhookTransaction kuhakikisha data inakuwa sahihi
        $paymentStatus = $status === 'COMPLETED' ? Transaction::STATUS_COMPLETED : Transaction::STATUS_FAILED;
        $reference = $payload['reference'] ?? ($payload['transid'] ?? null);
        $method = $payload['channel'] ?? null;
        $notes = $paymentStatus === Transaction::STATUS_COMPLETED 
            ? 'ZenoPay Webhook: Payment completed successfully.' 
            : 'ZenoPay Webhook: Payment failed. Reason: ' . ($payload['message'] ?? 'Unknown');

        $result = $this->processWebhookTransaction($transaction, $paymentStatus, $reference, $method, $notes);

        if ($result) {
            return response()->json(['status' => 'success']);
        }

        return response()->json(['status' => 'error', 'message' => 'Processing failed'], 500);
        } catch (\Exception $e) {
            Log::error('ZenoPay Webhook: Exception occurred.', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['status' => 'error', 'message' => 'Internal server error'], 500);
        }
    }

    /**
     * Shughulikia majibu ya malipo kutoka AzamPay callback.
     */
    public function handleAzamPayWebhook(Request $request)
    {
        $headers = $request->headers->all();
        // Standardise headers for signature verification (convert arrays to string values if needed)
        $processedHeaders = array_map(fn($v) => is_array($v) ? $v[0] : $v, $headers);
        $payload = $request->all();

        Log::info('AzamPay Webhook: Hit.', ['payload' => $payload, 'headers' => $processedHeaders]);

        $paymentManager = app(\App\Services\Payments\PaymentManager::class);
        
        if (!$paymentManager->driver('azampay')->validateWebhookSignature($payload, $processedHeaders)) {
            Log::critical('AzamPay Webhook: UNAUTHORIZED Webhook request (Signature invalid).', ['ip' => $request->ip()]);
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        // AzamPay uses 'utilityref' or 'externalReference' for order ID
        $orderId = $payload['utilityref'] ?? $payload['externalReference'] ?? null;
        $status = strtoupper($payload['status'] ?? '');

        if (!$orderId) {
            Log::warning('AzamPay Webhook: Missing order reference.', ['payload' => $payload]);
            return response()->json(['status' => 'error', 'message' => 'Missing utilityref'], 400);
        }

        $transaction = Transaction::where('order_id', $orderId)->first();
        if (!$transaction) {
            Log::error('AzamPay Webhook: Transaction not found.', ['order_id' => $orderId]);
            return response()->json(['status' => 'success', 'message' => 'Not found but acknowledged']);
        }

        $paymentStatus = $status === 'SUCCESS' || $status === 'COMPLETED'
            ? Transaction::STATUS_COMPLETED 
            : Transaction::STATUS_FAILED;

        $reference = $payload['transactionId'] ?? null;
        $method = $payload['operator'] ?? null;
        $notes = $paymentStatus === Transaction::STATUS_COMPLETED 
            ? 'AzamPay Webhook: Payment completed successfully.' 
            : 'AzamPay Webhook: Payment failed. Message: ' . ($payload['message'] ?? 'Unknown');

        $success = $this->processWebhookTransaction($transaction, $paymentStatus, $reference, $method, $notes);

        return response()->json(['status' => $success ? 'success' : 'error']);
    }

    /**
     * Shughulikia majibu ya malipo kutoka MalipoPay callback.
     */
    public function handleMalipoPayWebhook(Request $request)
    {
        $headers = $request->headers->all();
        $processedHeaders = array_map(fn($v) => is_array($v) ? $v[0] : $v, $headers);
        $payload = $request->all();

        Log::info('MalipoPay Webhook: Hit.', ['payload' => $payload, 'headers' => $processedHeaders]);

        $paymentManager = app(\App\Services\Payments\PaymentManager::class);

        if (!$paymentManager->driver('malipopay')->validateWebhookSignature($payload, $processedHeaders)) {
            Log::critical('MalipoPay Webhook: UNAUTHORIZED Webhook request (Signature invalid).', ['ip' => $request->ip()]);
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $orderId = $payload['order_id'] ?? null;
        $status = strtoupper($payload['status'] ?? '');

        if (!$orderId) {
            Log::warning('MalipoPay Webhook: Missing order_id.', ['payload' => $payload]);
            return response()->json(['status' => 'error', 'message' => 'Missing order_id'], 400);
        }

        $transaction = Transaction::where('order_id', $orderId)->first();
        if (!$transaction) {
            Log::error('MalipoPay Webhook: Transaction not found.', ['order_id' => $orderId]);
            return response()->json(['status' => 'success', 'message' => 'Not found but acknowledged']);
        }

        $paymentStatus = $status === 'SUCCESS' || $status === 'COMPLETED'
            ? Transaction::STATUS_COMPLETED 
            : Transaction::STATUS_FAILED;

        $reference = $payload['transaction_id'] ?? null;
        $method = $payload['channel'] ?? null;
        $notes = $paymentStatus === Transaction::STATUS_COMPLETED 
            ? 'MalipoPay Webhook: Payment completed successfully.' 
            : 'MalipoPay Webhook: Payment failed.';

        $success = $this->processWebhookTransaction($transaction, $paymentStatus, $reference, $method, $notes);

        return response()->json(['status' => $success ? 'success' : 'error']);
    }

    /**
     * Mchakato wa pamoja wa kusasisha muamala na models zinazohusiana.
     */
    protected function processWebhookTransaction(
        Transaction $transaction, 
        string $targetStatus, 
        ?string $reference, 
        ?string $method, 
        ?string $notes
    ): bool {
        if ($transaction->status !== Transaction::STATUS_PENDING) {
            Log::info('Webhook Process: Transaction is already processed.', [
                'order_id' => $transaction->order_id, 
                'status' => $transaction->status
            ]);
            return true;
        }

        try {
            DB::transaction(function () use ($transaction, $targetStatus, $reference, $method, $notes) {
                // Sasisha transaction
                $transaction->update([
                    'status' => $targetStatus,
                    'gateway_reference' => $reference,
                    'payment_method' => $method,
                    'notes' => $notes,
                ]);

                if ($targetStatus === Transaction::STATUS_COMPLETED) {
                    $payable = $transaction->payable;

                    if ($payable instanceof MarathonRegistration) {
                        $payable->update(['status' => MarathonRegistration::STATUS_COMPLETED]);
                        if ($payable->email) {
                            Mail::to($payable->email)->queue(new MarathonPaymentCompleted($payable));
                        }
                        User::where('is_admin', true)->first()?->notify(new NewMarathonRegistration($payable));
                    } 
                    elseif ($payable instanceof NomineeApplication) {
                        $payable->update(['status' => NomineeApplication::STATUS_PENDING_REVIEW]);
                        Mail::to($payable->applicant_email)->queue(new NomineePaymentCompleted($payable));
                        User::where('is_admin', true)->first()?->notify(new NewNomineeApplication($payable));
                    } 
                    elseif ($payable instanceof TicketPurchase) {
                        $payable->update(['status' => TicketPurchase::STATUS_COMPLETED]);
                        Mail::to($payable->purchaser_email)->queue(new TicketPaymentCompleted($payable));
                        User::where('is_admin', true)->first()?->notify(new NewTicketPurchase($payable));
                    } 
                    elseif ($payable instanceof \App\Models\VoteOrder) {
                        $payable->update(['status' => \App\Models\VoteOrder::STATUS_COMPLETED]);

                        // Cast the votes!
                        $vote = \App\Models\Vote::create([
                            'nominee_id' => $payable->nominee_id,
                            'category_id' => $payable->category_id,
                            'transaction_id' => $transaction->id,
                            'phone_number' => $payable->phone_number,
                            'votes_count' => $payable->votes_count,
                            'ip_address' => request()->ip(),
                            'user_agent' => request()->userAgent(),
                        ]);

                        // Generate secure integrity signature
                        $integrityService = new \App\Services\Voting\VoteIntegrityService();
                        $integrityService->sign($vote);

                        Log::info('Webhook Process: Votes cast successfully.', [
                            'vote_order_id' => $payable->id, 
                            'votes_count' => $payable->votes_count, 
                            'nominee' => $payable->nominee->name ?? 'N/A'
                        ]);
                    }
                } 
                else { // Transaction failed
                    $payable = $transaction->payable;
                    if ($payable) {
                        if ($payable instanceof MarathonRegistration) {
                            $payable->update(['status' => MarathonRegistration::STATUS_PAYMENT_FAILED]);
                            if ($payable->email) {
                                Mail::to($payable->email)->queue(new MarathonPaymentFailed($payable));
                            }
                        } 
                        elseif ($payable instanceof NomineeApplication) {
                            $payable->update(['status' => NomineeApplication::STATUS_PAYMENT_FAILED]);
                            Mail::to($payable->applicant_email)->queue(new NomineePaymentFailed($payable));
                        } 
                        elseif ($payable instanceof TicketPurchase) {
                            $payable->update(['status' => TicketPurchase::STATUS_FAILED]);
                        } 
                        elseif ($payable instanceof \App\Models\VoteOrder) {
                            $payable->update(['status' => \App\Models\VoteOrder::STATUS_FAILED]);
                        }
                    }
                }
            });

            Log::info("Webhook Process: Completed successfully.", ['order_id' => $transaction->order_id]);
            return true;
        } catch (\Exception $e) {
            Log::error("Webhook Process: Error during transaction commit.", [
                'order_id' => $transaction->order_id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}