<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use AfricasTalking\SDK\AfricasTalking;
use Illuminate\Support\Facades\Log;

class AfricasTalkingOtpDriver implements OtpDriverInterface
{
    protected string $username;
    protected string $apiKey;
    protected string $from;

    public function __construct(array $config)
    {
        $this->username = $config['username'] ?? 'sandbox';
        $this->apiKey = $config['api_key'] ?? '';
        $this->from = $config['from'] ?? '';
    }

    /**
     * Send OTP via Africa's Talking SMS.
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool
    {
        // Normalise phone number to international E.164 (+255XXXXXXXXX)
        $formattedPhone = $this->formatPhoneNumber($phone);
        $message = "Your TAPHE OTP is:: $code. Usishiriki na mtu yeyote. Inatumika kwa dakika 5 tu.";

        if (empty($this->apiKey)) {
            Log::error("Africa's Talking API Key not configured. Logging OTP instead: $code");
            return false;
        }

        try {
            $at = new AfricasTalking($this->username, $this->apiKey);
            $sms = $at->sms();

            $options = [
                'to'      => $formattedPhone,
                'message' => $message,
            ];

            if (!empty($this->from)) {
                $options['from'] = $this->from;
            }

            $response = $sms->send($options);

            // Accessing SDK response data
            if (isset($response['status']) && $response['status'] === 'success') {
                Log::info("Africa's Talking SMS sent successfully to $formattedPhone");
                return true;
            }

            if (isset($response['data']->SMSMessageData->Recipients[0])) {
                $status = $response['data']->SMSMessageData->Recipients[0]->status;
                if ($status === 'Success' || $status === 'Success' || $status === 'Sent') {
                    Log::info("Africa's Talking SMS sent successfully to $formattedPhone");
                    return true;
                }
                Log::error("Africa's Talking SMS failed. Recipient Status: " . $status);
                return false;
            }

            Log::info("Africa's Talking SMS response: " . json_encode($response));
            return true;
        } catch (\Exception $e) {
            Log::error("Africa's Talking SMS Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Formats phone number to +255xxxxxxxxx format.
     */
    protected function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone); // remove non-digits

        if (str_starts_with($phone, '0')) {
            $phone = '+255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '7') || str_starts_with($phone, '6')) {
            $phone = '+255' . $phone;
        } elseif (str_starts_with($phone, '255')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
