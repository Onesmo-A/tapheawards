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
        Schema::table('guest_invitations', function (Blueprint $table) {
            $table->string('event_name')->nullable()->after('guest_title');
            $table->string('event_date')->nullable()->after('event_name');
            $table->string('event_time')->nullable()->after('event_date');
            $table->string('event_venue')->nullable()->after('event_time');
            $table->string('dress_code')->nullable()->after('event_venue');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guest_invitations', function (Blueprint $table) {
            $table->dropColumn([
                'event_name',
                'event_date',
                'event_time',
                'event_venue',
                'dress_code',
            ]);
        });
    }
};
