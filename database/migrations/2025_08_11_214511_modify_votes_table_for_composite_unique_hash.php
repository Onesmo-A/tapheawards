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
            // 1. Ongeza category_id (isiyokuwa null) ili tuweze kuweka kizuizi sahihi
            $table->foreignId('category_id')->after('nominee_id')->constrained()->onDelete('cascade');

            // 2. Ondoa kizuizi cha kipekee (unique index) kisicho sahihi
            $table->dropUnique('votes_multi_factor_hash_unique');

            // 3. Weka kizuizi sahihi cha mchanganyiko (composite unique index)
            $table->unique(['category_id', 'multi_factor_hash'], 'vote_category_hash_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->dropUnique('vote_category_hash_unique');
            $table->unique('multi_factor_hash', 'votes_multi_factor_hash_unique');
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
