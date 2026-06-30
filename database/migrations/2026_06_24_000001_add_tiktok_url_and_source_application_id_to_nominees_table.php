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
        Schema::table('nominees', function (Blueprint $table) {
            if (!Schema::hasColumn('nominees', 'tiktok_url')) {
                $table->string('tiktok_url')->nullable()->after('instagram_url');
            }

            if (!Schema::hasColumn('nominees', 'source_application_id')) {
                $table->foreignUuid('source_application_id')
                    ->nullable()
                    ->after('tiktok_url')
                    ->constrained('nominee_applications')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nominees', function (Blueprint $table) {
            if (Schema::hasColumn('nominees', 'source_application_id')) {
                $table->dropConstrainedForeignId('source_application_id');
            }

            if (Schema::hasColumn('nominees', 'tiktok_url')) {
                $table->dropColumn('tiktok_url');
            }
        });
    }
};
