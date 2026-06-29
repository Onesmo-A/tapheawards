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
        Schema::table('marathon_registrations', function (Blueprint $table) {
            // 1. Badilisha 'user_id' iweze kukubali NULL na weka 'on delete set null'
            // Tumia DB::statement kwa sababu kubadilisha nullable na foreign key kwa pamoja kunahitaji raw SQL
            DB::statement('ALTER TABLE marathon_registrations MODIFY user_id BIGINT UNSIGNED NULL');
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // 2. Ongeza columns mpya kama hazipo
            if (!Schema::hasColumn('marathon_registrations', 'race_type')) {
                $table->string('race_type')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('marathon_registrations', 'region')) {
                $table->string('region')->nullable()->after('state');
            }
            if (!Schema::hasColumn('marathon_registrations', 'payment_notes')) {
                $table->text('payment_notes')->nullable()->after('payment_gateway_reference');
            }

            // 3. Hakikisha 'unique_code' ni unique
            if (!collect(DB::select("SHOW INDEXES FROM marathon_registrations WHERE Key_name = 'marathon_registrations_unique_code_unique'"))->pluck('Key_name')->contains('marathon_registrations_unique_code_unique')) {
                 $table->unique('unique_code');
            }

            // 4. Badilisha 'phone_number' kutoka 07... kwenda 255...
            // Hii ni muhimu kwa usajili uliopita
            DB::statement("UPDATE marathon_registrations SET phone_number = CONCAT('255', SUBSTR(phone_number, 2)) WHERE phone_number LIKE '0%'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marathon_registrations', function (Blueprint $table) {
            // Hapa unaweza kuweka logic ya kurudisha mabadiliko, ingawa mara nyingi si lazima
            $table->dropForeign(['user_id']);
            DB::statement('ALTER TABLE marathon_registrations MODIFY user_id BIGINT UNSIGNED NOT NULL');
            $table->foreign('user_id')->references('id')->on('users');

            if (Schema::hasColumn('marathon_registrations', 'race_type')) {
                $table->dropColumn('race_type');
            }
            if (Schema::hasColumn('marathon_registrations', 'region')) {
                $table->dropColumn('region');
            }
            if (Schema::hasColumn('marathon_registrations', 'payment_notes')) {
                $table->dropColumn('payment_notes');
            }
            $table->dropUnique('marathon_registrations_unique_code_unique');
        });
    }
};
