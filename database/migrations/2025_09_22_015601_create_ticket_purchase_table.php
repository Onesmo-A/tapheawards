<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ticket_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('ticket_type_id')->constrained()->onDelete('cascade');
            $table->string('purchaser_name');
            $table->string('purchaser_email');
            $table->string('purchaser_phone');
            $table->integer('quantity');
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending_payment'); // pending_payment, completed, failed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_purchases');
    }
};
