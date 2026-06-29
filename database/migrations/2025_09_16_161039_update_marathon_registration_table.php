<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marathon_registrations', function (Blueprint $table) {
            // 1. Fanya user_id iweze kuwa NULL (optional)
            $table->unsignedBigInteger('user_id')->nullable()->change();

            // 2. Ongeza safu ya unique_code kwa ajili ya namba ya ushiriki
            $table->string('unique_code')->unique()->after('id');

            // 3. Ongeza safu ya kuhifadhi maelezo ya malipo
            $table->string('payment_gateway_reference')->nullable()->after('status');
            $table->text('payment_notes')->nullable()->after('payment_gateway_reference');
        });
    }

    public function down(): void
    {
        Schema::table('marathon_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'unique_code',
                'payment_gateway_reference',
                'payment_notes'
            ]);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
