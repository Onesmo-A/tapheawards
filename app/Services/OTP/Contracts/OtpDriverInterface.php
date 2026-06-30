<?php

namespace App\Services\OTP\Contracts;

interface OtpDriverInterface
{
    /**
     * Send an OTP code to a phone number.
     *
     * @param string $phone
     * @param string $code
     * @param string $channel ('sms' or 'whatsapp')
     * @return bool
     */
    public function send(string $phone, string $code, string $channel = 'sms'): bool;
}
