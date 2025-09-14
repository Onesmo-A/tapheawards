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
        // Fanya migration iwe salama kwa kuangalia kama safu wima zipo kabla ya kuziongeza
        if (!Schema::hasColumn('votes', 'fingerprint_js')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->text('fingerprint_js')->after('fingerprint')->nullable();
                $table->string('screen_resolution')->after('fingerprint_js')->nullable();
                $table->string('timezone')->after('screen_resolution')->nullable();
                $table->string('language')->after('timezone')->nullable();
                $table->string('multi_factor_hash')->after('language')->nullable()->unique();
                $table->timestamp('voted_at')->after('multi_factor_hash')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Fanya 'down' method iwe salama pia
        if (Schema::hasColumn('votes', 'fingerprint_js')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->dropColumn(['fingerprint_js', 'screen_resolution', 'timezone', 'language', 'multi_factor_hash', 'voted_at']);
            });
        }
    }
};
