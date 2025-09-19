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
        Schema::table('nominee_applications', function (Blueprint $table) {
            // Ongeza safu ya kuhifadhi ID ya admin aliyefanya mapitio.
            // Inahusiana na jedwali la 'users'.
            $table->foreignId('reviewed_by')->nullable()->after('status')->constrained('users')->onDelete('set null');

            // Ongeza safu ya kuhifadhi muda ambao mapitio yalifanyika.
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');

            // Ongeza safu ya kuhifadhi sababu ya kukataliwa kwa ombi.
            $table->text('rejection_reason')->nullable()->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nominee_applications', function (Blueprint $table) {
            // Hii ni kwa ajili ya kurudisha mabadiliko (rollback)
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['reviewed_by', 'reviewed_at', 'rejection_reason']);
        });
    }
};
