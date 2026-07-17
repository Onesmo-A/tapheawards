<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BeemOtpDriver implements OtpDriverInterface
{
    protected string $apiKey;
    protected string $secretKey;
    protected string $senderId;
    protected string $url;

    public function __construct(array $config)
    {
        $this->apiKey = $config['api_key'] ?? '';
        $this->secretKey = $config['secret_key'] ?? '';
        $this->senderId = $config['sender_id'] ?? 'INFO';
        $this->url = $config['url'] ?? 'https://api.beem.africa/v1/send';
    }

    /**
     * Send OTP via Beem SMS.
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool
    {
        // Normalise phone number to 255XXXXXXXXX
        $formattedPhone = $this->formatPhoneNumber($phone);
        $message = "Your TAPHE OTP is:: $code. Usishiriki na mtu yeyote. Inatumika kwa dakika 5 tu.";

        // Support channel parameter
        if ($channel === 'whatsapp') {
            Log::info("WhatsApp channel selected for Beem: Sending via SMS since Beem WhatsApp driver requires a separate subscription. To: $formattedPhone");
        }

        if (empty($this->apiKey) || empty($this->secretKey)) {
            Log::error("Beem API Key or Secret Key not configured. Logging OTP instead: $code");
            return false;
        }

        try {
            $request = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($this->apiKey . ':' . $this->secretKey),
                'Content-Type' => 'application/json',
            ]);

            if (app()->environment('local')) {
                $request = $request->withoutVerifying();
            }

            $response = $request->post($this->url, [
                'source_addr' => $this->senderId,
                'schedule_time' => '',
                'message' => $message,
                'recipients' => [
                    [
                        'recipient_id' => 1,
                        'dest_addr' => $formattedPhone,
                    ]
                ]
            ]);

            if ($response->successful()) {
                Log::info("Beem SMS sent successfully to $formattedPhone");
                return true;
            }

            Log::error("Beem SMS failed to send. Code: " . $response->status() . " Body: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Beem SMS HTTP Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Formats phone number to Tanzania 255xxxxxxxxx format.
     */
    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone); // remove non-digits

        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '7') || str_starts_with($phone, '6')) {
            $phone = '255' . $phone;
        }

        return $phone;
    }
}
