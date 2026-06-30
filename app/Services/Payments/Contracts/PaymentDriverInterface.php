<?php

namespace App\Services\Payments\Contracts;

use App\Models\Transaction;

interface PaymentDriverInterface
{
    /**
     * Initiate a payment push (USSD Push) request.
     *
     * @param Transaction $transaction
     * @param string $phoneNumber
     * @param string $provider (e.g. 'mpesa', 'tigopesa', 'airtelmoney')
     * @return array|null The gateway response, or null on failure.
     */
    public function initiate(Transaction $transaction, string $phoneNumber, string $provider): ?array;

    /**
     * Validate the webhook payload signature.
     *
     * @param array $payload
     * @param array $headers
     * @return bool
     */
    public function validateWebhookSignature(array $payload, array $headers): bool;
}
