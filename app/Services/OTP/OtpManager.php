<?php

namespace App\Services\OTP;

use Illuminate\Support\Manager;
use App\Services\OTP\Drivers\LogOtpDriver;
use App\Services\OTP\Drivers\BeemOtpDriver;

class OtpManager extends Manager
{
    /**
     * Get the default driver name.
     */
    public function getDefaultDriver(): string
    {
        return $this->container['config']->get('otp.default', 'log');
    }

    /**
     * Create Log OTP Driver.
     */
    protected function createLogDriver(): LogOtpDriver
    {
        return new LogOtpDriver();
    }

    /**
     * Create Beem OTP Driver.
     */
    protected function createBeemDriver(): BeemOtpDriver
    {
        return new BeemOtpDriver($this->container['config']->get('otp.drivers.beem'));
    }

    /**
     * Create Africa's Talking OTP Driver.
     */
    protected function createAfricastalkingDriver(): Drivers\AfricasTalkingOtpDriver
    {
        return new Drivers\AfricasTalkingOtpDriver($this->container['config']->get('otp.drivers.africastalking'));
    }

    /**
     * Create NextSMS OTP Driver.
     */
    protected function createNextsmsDriver(): Drivers\NextSmsOtpDriver
    {
        return new Drivers\NextSmsOtpDriver($this->container['config']->get('otp.drivers.nextsms'));
    }

    /**
     * Create UltraMsg OTP Driver.
     */
    protected function createUltramsgDriver(): Drivers\UltramsgOtpDriver
    {
        return new Drivers\UltramsgOtpDriver($this->container['config']->get('otp.drivers.ultramsg'));
    }
}


