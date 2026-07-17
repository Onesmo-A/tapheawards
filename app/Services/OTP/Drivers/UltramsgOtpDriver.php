<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UltramsgOtpDriver implements OtpDriverInterface
{
    protected string $instanceId;
    protected string $token;

    public function __construct(array $config)
    {
        $this->instanceId = $config['instance_id'] ?? '';
        $this->token = $config['token'] ?? '';
    }

    /**
     * Send OTP via UltraMsg WhatsApp.
     */
    public function send(string $phone, string $code, string $channel = 'whatsapp'): bool
    {
        // Format phone number to international format (e.g., +255XXXXXXXXX)
        $formattedPhone = $this->formatPhoneNumber($phone);
        $message = "Your TAPHE OTP is: $code. Don't share it with anyone. It will expire in 5 minutes.";

        if (empty($this->instanceId) || empty($this->token)) {
            Log::error("UltraMsg Instance ID or Token not configured. Logging OTP instead: $code");
            return false;
        }

        $url = "https://api.ultramsg.com/{$this->instanceId}/messages/chat";

        try {
            $request = Http::asForm();

            // Bypass SSL verification for local development
            if (app()->environment('local')) {
                $request = $request->withoutVerifying();
            }

            $response = $request->post($url, [
                'token' => $this->token,
                'to' => $formattedPhone,
                'body' => $message,
                'priority' => 1, // High priority for OTPs
            ]);

            if ($response->successful()) {
                Log::info("UltraMsg WhatsApp sent successfully to $formattedPhone. Status: " . $response->status());
                return true;
            }

            Log::error("UltraMsg WhatsApp failed to send. Code: " . $response->status() . " Body: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("UltraMsg WhatsApp HTTP Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Formats phone number to international format with + prefix.
     */
    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone); // remove non-digits

        if (str_starts_with($phone, '0')) {
            $phone = '255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '7') || str_starts_with($phone, '6')) {
            $phone = '255' . $phone;
        }

        if (!str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
