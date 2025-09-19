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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nominee_id')->constrained()->onDelete('cascade');
            $table->string('ip_address');
            $table->text('user_agent')->nullable();
            $table->timestamps();
            $table->unique(['nominee_id', 'ip_address']); // Kuzuia kura nyingi kutoka IP moja kwa mshiriki mmoja
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};

