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
            $table->boolean('voting_enabled')->default(true)->after('status');
        });

        Schema::table('nominees', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false)->after('votes_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('voting_enabled');
        });

        Schema::table('nominees', function (Blueprint $table) {
            $table->dropColumn('is_suspended');
        });
    }
};
