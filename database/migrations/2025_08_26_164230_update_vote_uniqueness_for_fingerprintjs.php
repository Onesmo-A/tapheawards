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
            // Hatua ya 1: Ondoa kizuizi cha 'unique' kilichokuwa kwenye 'multi_factor_hash' pekee.
            // Hii inaruhusu mabadiliko ya sheria ya upigaji kura bila kusababisha makosa ya database.
            // Jina la index 'votes_multi_factor_hash_unique' linatokana na jinsi Laravel inavyotengeneza majina.
            if (Schema::hasIndex('votes', 'votes_multi_factor_hash_unique')) {
                $table->dropUnique('votes_multi_factor_hash_unique');
            }

            // Hatua ya 2: Weka kizuizi kipya cha 'unique' kinachochanganya 'category_id' na 'fingerprint_js'.
            // Hii ndiyo sheria mpya: fingerprint moja inaweza kupiga kura mara moja tu kwa kila kategoria.
            // Hii inatoa ulinzi kwenye database level.
            $table->unique(['category_id', 'fingerprint_js']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            // Rudisha hali ya awali kama ilivyokuwa kabla ya mabadiliko haya.
            
            // 1. Ondoa kizuizi kipya
            $table->dropUnique(['category_id', 'fingerprint_js']);

            // 2. Rudisha kizuizi cha awali kwenye 'multi_factor_hash'
            // Hakikisha haipo kabla ya kuiongeza ili kuzuia makosa.
            if (!Schema::hasIndex('votes', 'votes_multi_factor_hash_unique')) {
                $table->unique('multi_factor_hash', 'votes_multi_factor_hash_unique');
            }
        });
    }
};
