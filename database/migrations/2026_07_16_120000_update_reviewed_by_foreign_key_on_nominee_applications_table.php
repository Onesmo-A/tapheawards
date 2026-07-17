<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('nominee_applications', function (Blueprint $table) {
            // First, drop the existing foreign key constraint
            $table->dropForeign(['reviewed_by']);
        });

        // Set all reviewed_by to NULL if the UUID does not exist in admin_users
        // to avoid foreign key constraint validation failure.
        DB::table('nominee_applications')
            ->whereNotNull('reviewed_by')
            ->whereNotIn('reviewed_by', function ($query) {
                $query->select('id')->from('admin_users');
            })
            ->update(['reviewed_by' => null]);

        Schema::table('nominee_applications', function (Blueprint $table) {
            // Add a new foreign key constraint pointing to the admin_users table
            $table->foreign('reviewed_by')
                ->references('id')
                ->on('admin_users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nominee_applications', function (Blueprint $table) {
            // Drop the foreign key pointing to admin_users
            $table->dropForeign(['reviewed_by']);
        });

        Schema::table('nominee_applications', function (Blueprint $table) {
            // Restore the foreign key pointing to users
            $table->foreign('reviewed_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }
};
