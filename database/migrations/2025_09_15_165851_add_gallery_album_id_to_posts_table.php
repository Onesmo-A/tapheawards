<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->foreignUuid('gallery_album_id')
                  ->nullable()
                  ->constrained('gallery_albums')
                  ->onDelete('set null')
                  ->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['gallery_album_id']);
            $table->dropColumn('gallery_album_id');
        });
    }
};
