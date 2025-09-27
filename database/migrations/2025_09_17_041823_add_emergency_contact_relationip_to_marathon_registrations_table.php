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
            $table->string('emergency_contact_relationship')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marathon_registrations', function (Blueprint $table) {
            $table->string('emergency_contact_relationship')->nullable(false)->change();
        });
    }
};
