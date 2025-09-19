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
        Schema::table('winners', function (Blueprint $table) {
            // Hii inazuia kuwepo kwa mshindi zaidi ya mmoja
            // kwa kila kategoria katika mwaka mmoja.
            $table->unique(['category_id', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('winners', function (Blueprint $table) {
            $table->dropUnique(['category_id', 'year']);
        });
    }
};
