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
        // 1. Create category_groups table
        Schema::create('category_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // 2. Modify categories table to add category_group_id and drop parent_id
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignUuid('category_group_id')
                ->nullable()
                ->after('id')
                ->constrained('category_groups')
                ->onDelete('cascade');

            // Drop self-referential foreign key constraint first, then the column
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->uuid('parent_id')->nullable()->after('id');
            $table->dropForeign(['category_group_id']);
            $table->dropColumn('category_group_id');
        });

        Schema::dropIfExists('category_groups');
    }
};
