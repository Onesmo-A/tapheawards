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
        Schema::table('categories', function (Blueprint $table) {
            // Ongeza safu ya nomination_fee.
            // Itakuwa decimal kwa usahihi wa pesa, default ni 0.
            // Inaweza kuwa null kama ni kundi kuu lisilo na gharama.
            $table->decimal('nomination_fee', 8, 2)->nullable()->default(0.00)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('nomination_fee');
        });
    }
};
