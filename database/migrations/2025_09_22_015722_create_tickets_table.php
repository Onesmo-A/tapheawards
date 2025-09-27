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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_purchase_id')->constrained()->onDelete('cascade');
            $table->string('ticket_code')->unique(); // Mfano: TKT-A9B3C7D1E8F2
            $table->string('qr_code_path')->nullable(); // Njia ya picha ya QR code
            $table->timestamp('checked_in_at')->nullable(); // Muda alipoingia
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->onDelete('set null'); // Admin aliyeskani
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
