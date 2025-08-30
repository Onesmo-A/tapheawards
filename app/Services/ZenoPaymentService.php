<?php

namespace App\Services;

use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZenoPaymentService
{
    protected string $baseUrl;
    protected ?string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.zenopay.url');
        $this->apiKey = config('services.zenopay.key');
    }

    /**
     * Anzisha ombi la malipo kwa kutumia Mobile Money Tanzania.
     * Inapokea object ya Transaction pekee.
     *
     * @param Transaction $transaction
     * @return bool True kama ombi limetumwa, false kama imeshindikana.
     */
    public function initiatePayment(Transaction $transaction): bool
    {
        if (!$this->baseUrl || !$this->apiKey) {
            Log::critical('ZenoPay Service Not Configured: URL or API Key is missing.');
            return false;
        }

        // Endpoint maalum kwa malipo ya simu Tanzania
        $endpoint = $this->baseUrl . '/payments/mobile_money_tanzania';

        // Payload kulingana na ZENOPAY DOCUMENTATION.txt
        $payload = [
            'order_id' => $transaction->order_id,
            'buyer_email' => $transaction->user->email,
            'buyer_name' => $transaction->payable->applicant_name, // Pata jina kutoka kwa application
            'buyer_phone' => $transaction->phone_number, // Pata namba ya simu kutoka kwa transaction
            'amount' => (int) $transaction->amount, // Hakikisha ni integer
            'webhook_url' => route('api.webhooks.zenopay'),
        ];

        try {
            Log::info('Initiating ZenoPay Payment', ['endpoint' => $endpoint, 'payload' => $payload]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-api-key' => $this->apiKey,
            ])->timeout(30)->post($endpoint, $payload);

            if ($response->successful() && $response->json('status') === 'success') {
                Log::info('ZenoPay Initiation Successful', ['order_id' => $transaction->order_id, 'response' => $response->json()]);
                return true;
            }

            Log::error('ZenoPay Initiation Failed', ['order_id' => $transaction->order_id, 'status' => $response->status(), 'response' => $response->body()]);
            return false;

        } catch (\Exception $e) {
            Log::error('ZenoPay HTTP Request Exception', ['order_id' => $transaction->order_id, 'error' => $e->getMessage()]);
            return false;
        }
    }
}