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
            // Lengo la migration hii ni kuondoa kizuizi cha 'unique' kwenye ip_address na nominee_id.
            // Hatua ya kuondoa na kurudisha 'foreign key' haikuwa ya lazima na ndiyo iliyosababisha kosa.
            // Tunaangalia kama index ipo kwanza ili kuzuia kosa kama migration imeshatekelezwa.
            if (Schema::hasIndex('votes', 'votes_nominee_id_ip_address_unique')) {
                // Tunatumia majina ya safu wima (columns) badala ya jina la index kwa usalama zaidi.
                $table->dropUnique(['nominee_id', 'ip_address']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            if (!Schema::hasIndex('votes', 'votes_nominee_id_ip_address_unique')) {
                $table->unique(['nominee_id', 'ip_address']);
            }
        });
    }
};
