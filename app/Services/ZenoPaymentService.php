<?php

namespace App\Services;

use App\Models\NomineeApplication;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ZenoPaymentService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.zenopay.base_uri');
        $this->apiKey = config('services.zenopay.key');
    }

    /**
     * Anzisha ombi la malipo kwenda ZenoPay.
     *
     * @param NomineeApplication $application
     * @param User $user
     * @param int $amount
     * @param string $phoneNumber
     * @param string $webhookUrl
     * @return Transaction|null
     */
    public function initiatePayment(NomineeApplication $application, User $user, int $amount, string $phoneNumber, string $webhookUrl): ?Transaction
    {
        // 1. Unda rekodi ya transaction kwenye mfumo wetu kwanza
        $transaction = $application->transaction()->create([
            'user_id' => $user->id,
            'order_id' => (string) Str::uuid(), // Hii ni ID yetu ya ndani
            'amount' => $amount,
            'currency' => 'TZS',
            'status' => 'pending',
            'phone_number' => $phoneNumber,
        ]);

        // 2. Andaa data ya kutuma kwenda ZenoPay kulingana na documentation
        $payload = [
            'amount' => $amount,
            'buyer_phone' => $phoneNumber,
            'buyer_email' => $user->email,
            'buyer_name' => $user->name,
            'order_id' => $transaction->order_id,
            'webhook_url' => $webhookUrl,
        ];

        // 3. Tuma ombi kwenda ZenoPay API
        // Hapa hatutatumia DB::transaction, tutakamata exception kwenye Controller
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/payments/mobile_money_tanzania', $payload);

        if (!$response->successful()) {
            // Log the error for debugging
            Log::error('ZenoPay Initiation Failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'order_id' => $transaction->order_id,
            ]);
            // Rudisha null kuashiria ombi la API limeshindikana
            return null;
        }

        // Ikiwa imefanikiwa, ZenoPay itatuma STK push kwa mteja.
        // Sisi tunarudisha transaction yetu.
        return $transaction;
    }

    /**
     * Hakiki kama webhook imetoka ZenoPay kweli.
     */
    public function isWebhookAuthentic(Request $request): bool
    {
        // Njia rahisi na ya kawaida ni kulinganisha API key/secret kwenye header.
        return hash_equals($this->apiKey, $request->header('x-api-key'));
    }
}