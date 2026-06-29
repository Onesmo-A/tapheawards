<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_statistics', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_key', 80)->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('path', 255)->index();
            $table->string('route_name', 255)->nullable()->index();
            $table->string('referrer', 512)->nullable();
            $table->timestamp('visited_at')->useCurrent()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_statistics');
    }
};
