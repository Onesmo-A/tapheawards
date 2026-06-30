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
            $table->uuid('id')->primary();
            $table->foreignUuid('nominee_id')->constrained()->onDelete('cascade');
            $table->uuid('transaction_id')->nullable()->index();
            $table->string('phone_number');
            $table->unsignedInteger('votes_count')->default(1);
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('integrity_hash', 64)->nullable()->index();
            $table->timestamps();
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

