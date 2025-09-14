<?php

namespace App\Jobs;

use App\Models\Transaction; 
use App\Services\ZenoPaymentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
 
class InitiateZenoPayPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The transaction instance.
     *
     * @var \App\Models\Transaction
     */ 
    public $transaction;

    /**
     * Create a new job instance.
     *
     * @param \App\Models\Transaction $transaction
     */ 
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Execute the job.
     *
     * @param \App\Services\ZenoPayService $zenoPayService 
     * @return void
     */
    public function handle(ZenoPaymentService $zenoPaymentService): void
    {
        Log::info('Job InitiateZenoPayPayment started for order_id: ' . $this->transaction->order_id);
 
        // The service already handles logging and updating transaction on failure.
        $zenoPaymentService->initiatePayment($this->transaction);

        Log::info('Job InitiateZenoPayPayment finished for order_id: ' . $this->transaction->order_id);
    }
}