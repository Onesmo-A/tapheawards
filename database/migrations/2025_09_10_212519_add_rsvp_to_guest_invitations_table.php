<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guest_invitations', function (Blueprint $table) {
            // Hii itahifadhi jibu la mgeni: 'attending', 'declined', au 'pending'
            $table->string('rsvp_status')->default('pending')->after('status');
            // Hii itahifadhi muda ambao mgeni alijibu
            $table->timestamp('rsvp_at')->nullable()->after('rsvp_status');
        });
    }

    public function down(): void
    {
        Schema::table('guest_invitations', function (Blueprint $table) {
            $table->dropColumn(['rsvp_status', 'rsvp_at']);
        });
    }
};
