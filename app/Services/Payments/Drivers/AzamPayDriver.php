<?php

namespace App\Services\Payments\Drivers;

use App\Services\Payments\Contracts\PaymentDriverInterface;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AzamPayDriver implements PaymentDriverInterface
{
    protected string $apiKey;
    protected string $apiSecret;
    protected string $url;
    protected string $webhookUrl;
    protected string $appName;
    protected string $clientId;

    public function __construct(array $config)
    {
        $this->apiKey = $config['api_key'] ?? '';
        $this->apiSecret = $config['api_secret'] ?? '';
        $this->url = $config['url'] ?? 'https://sandbox.azampay.co.tz';
        $this->webhookUrl = $config['webhook_url'] ?? '';
        $this->appName = $config['app_name'] ?? 'TAPHE Awards';
        $this->clientId = $config['client_id'] ?? '';
    }

    /**
     * Initiate payment via AzamPay checkout push.
     */
    public function initiate(Transaction $transaction, string $phoneNumber, string $provider): ?array
    {
        $token = $this->getAccessToken();
        if (!$token) {
            Log::error("AzamPay Authentication failed.");
            return null;
        }

        $formattedPhone = $this->formatPhoneNumber($phoneNumber);
        
        $payload = [
            'clientId' => $this->clientId,
            'amount' => (string) $transaction->amount,
            'phoneNumber' => $formattedPhone,
            'mobileProvider' => $this->mapProvider($provider),
            'externalReference' => (string) $transaction->order_id,
            'appName' => $this->appName,
            'webhookUrl' => $this->webhookUrl,
        ];

        try {
            // endpoint checkout push
            $response = Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($this->url . '/api/v1/Checkout/Trigger', $payload);

            if ($response->successful()) {
                Log::info("AzamPay USSD Push initiated successfully for order {$transaction->order_id}");
                return $response->json();
            }

            Log::error("AzamPay Push failed. Status: {$response->status()} Body: " . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error("AzamPay Checkout HTTP Exception: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate the webhook payload signature.
     */
    public function validateWebhookSignature(array $payload, array $headers): bool
    {
        // AzamPay uses a callback signing or token check.
        // We will verify the Authorization header or check signature if supplied.
        // Usually, AzamPay webhook payload is verified using a shared secret hash or bearer token in authorization header.
        $authHeader = $headers['authorization'] ?? $headers['Authorization'] ?? '';
        if (empty($authHeader)) {
            return false;
        }

        // Remove 'Bearer ' prefix if present
        $token = preg_replace('/^Bearer\s+/i', '', $authHeader);

        // Simple validation matching token or signature
        return hash_equals($this->apiSecret, $token);
    }

    /**
     * Retrieve OAuth token from AzamPay.
     */
    protected function getAccessToken(): ?string
    {
        try {
            $response = Http::post($this->url . '/api/v1/Partner/Authenticate', [
                'clientId' => $this->clientId,
                'appName' => $this->appName,
                'apiSecret' => $this->apiSecret,
            ]);

            if ($response->successful() && isset($response->json()['data']['accessToken'])) {
                return $response->json()['data']['accessToken'];
            }

            Log::error("AzamPay token request failed: " . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error("AzamPay Auth Exception: " . $e->getMessage());
            return null;
        }
    }

    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);
        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        }
        return $phone;
    }

    protected function mapProvider(string $provider): string
    {
        $provider = strtolower($provider);
        if ($provider === 'mpesa' || $provider === 'vodacom') {
            return 'Mpesa';
        }
        if ($provider === 'tigopesa' || $provider === 'tigo') {
            return 'Tigo';
        }
        if ($provider === 'airtelmoney' || $provider === 'airtel') {
            return 'Airtel';
        }
        if ($provider === 'halopesa' || $provider === 'halotel') {
            return 'Halopesa';
        }
        return ucfirst($provider);
    }
}
