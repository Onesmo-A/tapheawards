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
        Schema::table('ticket_purchases', function (Blueprint $table) {
            $table->foreignId('transaction_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null')
                  ->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticket_purchases', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['transaction_id']);
            // Then drop the column
            $table->dropColumn('transaction_id');
        });
    }
};
