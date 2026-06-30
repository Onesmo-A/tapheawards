<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vote_attempt_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('nominee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 30)->index();
            $table->string('reason', 255)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('fingerprint_js')->nullable()->index();
            $table->string('screen_resolution')->nullable();
            $table->string('timezone')->nullable();
            $table->string('language', 20)->nullable();
            $table->string('multi_factor_hash')->nullable()->index();
            $table->json('meta')->nullable();
            $table->timestamp('attempted_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vote_attempt_logs');
    }
};
