<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nominee_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('applicant_name');
            $table->string('applicant_phone');
            $table->string('applicant_email');
            $table->text('bio');
            $table->string('photo_path')->nullable();
            $table->string('status')->default('pending_payment'); // pending_payment, pending_review, approved, rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nominee_applications');
    }
};
