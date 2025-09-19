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
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();
            $table->string('suggested_nominee_name');
            $table->string('suggested_nominee_phone')->nullable();
            $table->string('suggested_nominee_workplace')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->text('reason');
            $table->string('suggester_name')->nullable();
            $table->string('suggester_email')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'rejected', 'accepted'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestions');
    }
};
