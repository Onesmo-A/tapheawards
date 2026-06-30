<?php

namespace App\Services\Payments;

use Illuminate\Support\Manager;
use App\Services\Payments\Drivers\LogPaymentDriver;
use App\Services\Payments\Drivers\MalipoPayDriver;
use App\Services\Payments\Drivers\AzamPayDriver;

class PaymentManager extends Manager
{
    /**
     * Get the default driver name.
     */
    public function getDefaultDriver(): string
    {
        return $this->container['config']->get('payment.default', 'log');
    }

    /**
     * Create Log Payment Driver.
     */
    protected function createLogDriver(): LogPaymentDriver
    {
        return new LogPaymentDriver();
    }

    /**
     * Create MalipoPay Payment Driver.
     */
    protected function createMalipoPayDriver(): MalipoPayDriver
    {
        return new MalipoPayDriver($this->container['config']->get('payment.drivers.malipopay'));
    }

    /**
     * Create AzamPay Payment Driver.
     */
    protected function createAzamPayDriver(): AzamPayDriver
    {
        return new AzamPayDriver($this->container['config']->get('payment.drivers.azampay'));
    }
}
