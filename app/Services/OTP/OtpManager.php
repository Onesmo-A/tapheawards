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
}
