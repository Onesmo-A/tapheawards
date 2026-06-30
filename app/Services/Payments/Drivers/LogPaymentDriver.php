<?php

namespace App\Services\Payments\Drivers;

use App\Services\Payments\Contracts\PaymentDriverInterface;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class LogPaymentDriver implements PaymentDriverInterface
{
    /**
     * Initiate payment by logging it.
     */
    public function initiate(Transaction $transaction, string $phoneNumber, string $provider): ?array
    {
        Log::info("MOCK PAYMENT INITIATED: Order ID: {$transaction->order_id} | Phone: $phoneNumber | Provider: $provider | Amount: {$transaction->amount} TZS");
        
        return [
            'status' => 'success',
            'message' => 'USSD Push initiated successfully (Logged)',
            'reference' => 'LOG-' . uniqid(),
        ];
    }

    /**
     * Validation always returns true for mock.
     */
    public function validateWebhookSignature(array $payload, array $headers): bool
    {
        return true;
    }
}
