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
            // Angalia kama safu ya 'photo_url' ipo kabla ya kujaribu kuibadilisha jina
            if (Schema::hasColumn('nominees', 'photo_url')) {
                $table->renameColumn('photo_url', 'image_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nominees', function (Blueprint $table) {
            // Hii ni kwa ajili ya kurudisha nyuma mabadiliko ikihitajika
            if (Schema::hasColumn('nominees', 'image_path')) {
                $table->renameColumn('image_path', 'photo_url');
            }
        });
    }
};
