<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vote_archives', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('season_award_id')->nullable()->constrained('season_awards')->nullOnDelete();
            $table->foreignUuid('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('nominee_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('votes_count')->default(0);
            $table->timestamp('archived_at')->nullable()->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vote_archives');
    }
};
