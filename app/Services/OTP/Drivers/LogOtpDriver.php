<?php

namespace App\Services\OTP\Drivers;

use App\Services\OTP\Contracts\OtpDriverInterface;
use Illuminate\Support\Facades\Log;

class LogOtpDriver implements OtpDriverInterface
{
    /**
     * Send OTP by logging it to the log files.
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool
    {
        Log::info("MOCK OTP SENT via $channel: To: $phone | Code: $code");
        return true;
    }
}
