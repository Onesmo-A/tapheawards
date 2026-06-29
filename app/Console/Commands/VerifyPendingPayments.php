<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerifyPendingPayments extends Command
{
    protected $signature = 'payments:verify-pending';
    protected $description = 'Verify the status of old pending transactions with ZenoPay';

    public function handle()
    {
        $this->info('Starting verification of pending payments...');

        $pendingTransactions = Transaction::where('status', 'pending')
            ->where('created_at', '<', now()->subMinutes(15)) // Angalia zilizo na zaidi ya dakika 15
            ->get();

        if ($pendingTransactions->isEmpty()) {
            $this->info('No old pending transactions found.');
            return;
        }

        foreach ($pendingTransactions as $transaction) {
            $this->info("Verifying transaction: {$transaction->order_id}");

            $response = Http::withHeaders([
                'x-api-key' => config('services.zenopay.key'),
            ])->get(config('services.zenopay.url') . '/payments/order-status', [
                'order_id' => $transaction->order_id,
            ]);

            if ($response->successful() && $response->json('resultcode') === '000') {
                $data = $response->json('data.0', []);
                $paymentStatus = $data['payment_status'] ?? 'UNKNOWN';

                if ($paymentStatus === 'COMPLETED') {
                    $transaction->update(['status' => 'completed', 'gateway_reference' => $data['transid'] ?? null]);
                    $transaction->payable?->update(['status' => 'pending_review']);
                    $this->info(" -> Status updated to COMPLETED.");
                } elseif (in_array($paymentStatus, ['FAILED', 'CANCELLED'])) {
                    $transaction->update(['status' => 'failed', 'notes' => "Status checked via API: {$paymentStatus}"]);
                    $transaction->payable?->update(['status' => 'payment_failed']);
                    $this->warn(" -> Status updated to FAILED.");
                }
            } else {
                Log::error('ZenoPay Status Check API Failed', ['order_id' => $transaction->order_id, 'response' => $response->body()]);
            }
        }

        $this->info('Verification complete.');
    }
}
