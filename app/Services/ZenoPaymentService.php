<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZenoPaymentService
{
    protected $apiUrl; 
    protected $apiKey;
    protected $webhookUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.zenopay.url');
        $this->apiKey = config('services.zenopay.key');
        $this->webhookUrl = config('services.zenopay.webhook_url');
    }

    /**
     * Initiates a mobile money payment request to ZenoPay.
     *
     * @param Transaction $transaction
     * @return array|null The response from ZenoPay on success, or null on failure.
     */
    public function initiatePayment(Transaction $transaction): ?array
    {
        if (!$this->apiUrl || !$this->apiKey) {
            Log::critical('ZenoPay Service Not Configured: URL or API Key is missing.');
            return null;
        }

        // Endpoint maalum kwa malipo ya simu Tanzania
        $endpoint = $this->apiUrl . '/payments/mobile_money_tanzania';

        // ================== REKEBISHO MUHIMU ==================
        // Nyaraka za ZenoPay zinahitaji namba iwe katika muundo wa '07XXXXXXXX'.
        // Kwenye database tumehifadhi kama '2557XXXXXXXX'.
        // Tunahitaji kuibadilisha kabla ya kuituma.
        $zenoPayPhoneNumber = (string) $transaction->phone_number;
        if (str_starts_with($zenoPayPhoneNumber, '255')) {
            $zenoPayPhoneNumber = '0' . substr($zenoPayPhoneNumber, 3);
        }


        // Payload kulingana na ZENOPAY DOCUMENTATION.txt
        $payload = [
            'order_id' => $transaction->order_id,
            // ================== FIX MUHIMU ==================
            // Taarifa za mnunuzi (jina na email) zinapatikana kwenye model inayohusiana ('payable'),
            // sio kwenye 'transaction' yenyewe.
            'buyer_email' => $transaction->payable->email ?? $transaction->payable->applicant_email,
            'buyer_name' => $transaction->payable->full_name ?? $transaction->payable->applicant_name,
            'buyer_phone' => $zenoPayPhoneNumber,
            'amount' => (int) $transaction->amount, // Hakikisha ni integer
            'webhook_url' => $this->webhookUrl,
        ];

        Log::info('Initiating ZenoPay Payment', ['endpoint' => $endpoint, 'payload' => $payload]);

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey, // REKEBISHO: Tumia 'x-api-key' kama ilivyo kwenye nyaraka
                'Content-Type' => 'application/json',
            ])->timeout(45)->post($endpoint, $payload);

            if ($response->successful() && $response->json('status') === 'success') {
                Log::info('ZenoPay Initiation Successful', ['order_id' => $transaction->order_id, 'response' => $response->json()]);
                return $response->json();
            }

            Log::error('ZenoPay Initiation Failed', ['order_id' => $transaction->order_id, 'status' => $response->status(), 'response' => $response->body()]);
            $transaction->update(['status' => 'initiation_failed', 'notes' => 'API call failed: ' . $response->body()]);

            return null;

        } catch (\Exception $e) {
            Log::error('ZenoPay HTTP Request Exception', ['order_id' => $transaction->order_id, 'error' => $e->getMessage()]);
            $transaction->update(['status' => 'initiation_failed', 'notes' => 'HTTP Exception: ' . $e->getMessage()]);
            return null;
        }
    }
}