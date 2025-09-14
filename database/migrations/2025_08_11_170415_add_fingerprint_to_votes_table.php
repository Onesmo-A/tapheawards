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
        if (!Schema::hasColumn('votes', 'fingerprint')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->string('fingerprint')->after('user_agent')->nullable()->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('votes', 'fingerprint')) {
            Schema::table('votes', function (Blueprint $table) {
                $table->dropColumn('fingerprint');
            });
        }
    }
};
