<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NextSmsOtpDriver implements OtpDriverInterface
{
    protected string $username;
    protected string $password;
    protected string $senderId;
    protected bool $useTestMode;

    public function __construct(array $config)
    {
        $this->username = $config['username'] ?? '';
        $this->password = $config['password'] ?? '';
        $this->senderId = $config['sender_id'] ?? 'N-SMS';
        $this->useTestMode = $config['use_test_mode'] ?? false;
    }

    /**
     * Send OTP via NextSMS.
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool
    {
        // Format phone number to 255XXXXXXXXX (without +)
        $formattedPhone = $this->formatPhoneNumber($phone);
        $message = "Your TAPHE OTP is:: $code. Usishiriki na mtu yeyote. Inatumika kwa dakika 5 tu.";

        if ($channel === 'whatsapp') {
            Log::info("WhatsApp channel requested for NextSMS. Redirecting to SMS since NextSMS only supports SMS via this driver. To: $formattedPhone");
        }

        if (empty($this->username) || empty($this->password)) {
            Log::error("NextSMS Username or Password not configured. Logging OTP instead: $code");
            return false;
        }

        $baseUrl = 'https://messaging-service.co.tz';
        $endpoint = $this->useTestMode 
            ? '/api/sms/v1/test/text/single' 
            : '/api/sms/v1/text/single';
        $url = $baseUrl . $endpoint;

        try {
            $request = Http::withBasicAuth($this->username, $this->password)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ]);

            if (app()->environment('local')) {
                $request = $request->withoutVerifying();
            }

            $response = $request->post($url, [
                'from' => $this->senderId,
                'to' => $formattedPhone,
                'text' => $message,
                'reference' => uniqid('otp_', true),
            ]);

            if ($response->successful()) {
                Log::info("NextSMS sent successfully to $formattedPhone. Status: " . $response->status());
                return true;
            }

            Log::error("NextSMS failed to send. Code: " . $response->status() . " Body: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("NextSMS HTTP Exception: " . $e->getMessage());
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
