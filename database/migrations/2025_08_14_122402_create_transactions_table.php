<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->uuid('order_id')->unique(); // Kitambulisho cha kipekee tunachotuma Zeno
            $table->morphs('payable'); // Hii itaunda `payable_id` na `payable_type` (e.g., NomineeApplication, TicketOrder)
            $table->string('gateway_reference')->nullable()->index(); // Reference kutoka Zeno (transid)
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('TZS');
            $table->string('status')->default('pending'); // pending, completed, failed, cancelled
            $table->string('payment_method')->nullable(); // e.g., MPESA-TZ
            $table->string('phone_number');
            $table->text('notes')->nullable(); // Maelezo ya ziada kutoka Zeno
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
