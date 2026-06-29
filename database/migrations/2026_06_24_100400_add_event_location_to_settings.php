<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        foreach ([
            'event_location_name' => 'TBA Event Venue',
            'event_location_address' => 'Venue details will be announced soon.',
            'event_location_map_url' => null,
        ] as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value, 'updated_at' => $now, 'created_at' => $now]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'event_location_name',
            'event_location_address',
            'event_location_map_url',
        ])->delete();
    }
};
