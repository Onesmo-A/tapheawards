<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('season_awards', function (Blueprint $table) {
            if (! Schema::hasColumn('season_awards', 'cover_image_path')) {
                $table->string('cover_image_path')->nullable()->after('theme');
            }

            if (! Schema::hasColumn('season_awards', 'event_location_name')) {
                $table->string('event_location_name')->nullable()->after('event_date');
            }

            if (! Schema::hasColumn('season_awards', 'event_location_address')) {
                $table->text('event_location_address')->nullable()->after('event_location_name');
            }

            if (! Schema::hasColumn('season_awards', 'event_location_map_url')) {
                $table->string('event_location_map_url')->nullable()->after('event_location_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('season_awards', function (Blueprint $table) {
            foreach ([
                'cover_image_path',
                'event_location_name',
                'event_location_address',
                'event_location_map_url',
            ] as $column) {
                if (Schema::hasColumn('season_awards', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
