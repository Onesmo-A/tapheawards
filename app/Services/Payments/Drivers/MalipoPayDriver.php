<?php

namespace App\Services\Payments\Drivers;

use App\Services\Payments\Contracts\PaymentDriverInterface;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MalipoPayDriver implements PaymentDriverInterface
{
    protected string $apiKey;
    protected string $apiSecret;
    protected string $url;
    protected string $webhookUrl;

    public function __construct(array $config)
    {
        $this->apiKey = $config['api_key'] ?? '';
        $this->apiSecret = $config['api_secret'] ?? '';
        $this->url = $config['url'] ?? 'https://api.malipopay.co.tz/v1';
        $this->webhookUrl = $config['webhook_url'] ?? '';
    }

    /**
     * Initiate payment via MalipoPay USSD push.
     */
    public function initiate(Transaction $transaction, string $phoneNumber, string $provider): ?array
    {
        if (empty($this->apiKey) || empty($this->apiSecret)) {
            Log::critical('MalipoPay config missing API key or secret.');
            return null;
        }

        // Format phone number to national format e.g. 07XXXXXXXX or international 2557XXXXXXXX depending on gateway
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);

        $payload = [
            'api_key' => $this->apiKey,
            'order_id' => (string) $transaction->order_id,
            'amount' => (int) $transaction->amount,
            'phone_number' => $formattedPhone,
            'provider' => $this->mapProvider($provider),
            'webhook_url' => $this->webhookUrl,
            'signature' => $this->generateSignature($transaction->order_id, $transaction->amount, $formattedPhone),
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(30)->post($this->url . '/payments/ussd-push', $payload);

            if ($response->successful() && $response->json('status') === 'success') {
                Log::info("MalipoPay USSD Push initiated successfully. Order ID: {$transaction->order_id}");
                return $response->json();
            }

            Log::error("MalipoPay USSD Push failed: " . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error("MalipoPay HTTP Exception: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate the webhook payload signature.
     */
    public function validateWebhookSignature(array $payload, array $headers): bool
    {
        $signature = $headers['x-malipopay-signature'] ?? $headers['X-MalipoPay-Signature'] ?? '';
        if (empty($signature) || empty($this->apiSecret)) {
            return false;
        }

        $orderId = $payload['order_id'] ?? '';
        $amount = $payload['amount'] ?? '';
        $status = $payload['status'] ?? '';
        $transId = $payload['transaction_id'] ?? '';

        // Expected signature format
        $expectedSignature = hash_hmac('sha256', $orderId . $amount . $status . $transId, $this->apiSecret);

        return hash_equals($expectedSignature, $signature);
    }

    protected function generateSignature(string $orderId, float $amount, string $phone): string
    {
        return hash_hmac('sha256', $orderId . $amount . $phone, $this->apiSecret);
    }

    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if (str_starts_with($phone, '255')) {
            $phone = '0' . substr($phone, 3);
        }
        return $phone;
    }

    protected function mapProvider(string $provider): string
    {
        $mapping = [
            'mpesa' => 'VODACOM',
            'tigopesa' => 'TIGO',
            'airtelmoney' => 'AIRTEL',
            'halopesa' => 'HALOTEL',
        ];

        return $mapping[strtolower($provider)] ?? strtoupper($provider);
    }
}
