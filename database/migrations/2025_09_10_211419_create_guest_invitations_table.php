<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 // database/migrations/YYYY_MM_DD_HHMMSS_create_guest_invitations_table.php

public function up(): void
{
    Schema::create('guest_invitations', function (Blueprint $table) {
        $table->id();
        $table->uuid('uuid')->unique(); // Kwa ajili ya URL ya kipekee
        $table->string('guest_name'); // Jina la mgeni
        $table->string('guest_title')->nullable(); // Cheo cha mgeni (k.m. Mkurugenzi, Mheshimiwa)
        $table->string('status')->default('pending'); // (pending, sent, viewed)
        $table->timestamp('viewed_at')->nullable(); // Muda mgeni alipofungua mwaliko
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_invitations');
    }
};
