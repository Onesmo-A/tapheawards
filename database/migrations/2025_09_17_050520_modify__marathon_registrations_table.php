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
            // Kwanza, ondoa foreign key constraint iliyopo kwenye 'user_id'
            $table->dropForeign(['user_id']);

            // Badilisha safu zilizopo ziweze kuwa NULL (nullable)
            $table->string('email')->nullable()->change();
            $table->string('emergency_contact_relationship')->nullable()->change();
            $table->string('address')->nullable()->change();

            // Ongeza safu mpya 'race_type'
            if (!Schema::hasColumn('marathon_registrations', 'race_type')) {
                $table->string('race_type')->after('tshirt_size');
            }
            
            // Ongeza safu mpya 'unique_code'
            if (!Schema::hasColumn('marathon_registrations', 'unique_code')) {
                $table->string('unique_code')->unique()->after('phone_number');
            }

            // Futa safu ambazo hazitumiki tena
            $table->dropColumn(['user_id', 'city', 'state', 'nationality', 'amount']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marathon_registrations', function (Blueprint $table) {
            // Hapa unaweza kurudisha mabadiliko kama ilivyokuwa awali
            // Rudisha safu zilizofutwa
            $table->unsignedBigInteger('user_id')->nullable(); // nullable ili iendane na migration ya awali
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('email')->nullable(false)->change();
            $table->string('emergency_contact_relationship')->nullable(false)->change();
            $table->string('address')->nullable(false)->change();

            $table->dropColumn(['race_type', 'unique_code']);

            $table->string('city');
            $table->string('state');
            $table->string('nationality');
            $table->decimal('amount', 10, 2);
        });
    }
};
