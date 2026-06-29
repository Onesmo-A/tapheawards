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
        Schema::table('votes', function (Blueprint $table) {
            if (Schema::hasIndex('votes', 'votes_category_id_fingerprint_js_unique')) {
                $table->dropUnique('votes_category_id_fingerprint_js_unique');
            } else {
                $table->dropUnique(['category_id', 'fingerprint_js']);
            }

            $table->index(['category_id', 'ip_address', 'voted_at'], 'votes_category_ip_voted_at_index');
            $table->index(['category_id', 'multi_factor_hash', 'voted_at'], 'votes_category_hash_voted_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            if (Schema::hasIndex('votes', 'votes_category_ip_voted_at_index')) {
                $table->dropIndex('votes_category_ip_voted_at_index');
            }

            if (Schema::hasIndex('votes', 'votes_category_hash_voted_at_index')) {
                $table->dropIndex('votes_category_hash_voted_at_index');
            }

            $table->unique(['category_id', 'fingerprint_js']);
        });
    }
};
