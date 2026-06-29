<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tier')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('website_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        $now = now();
        $seedSponsors = [
            ['name' => 'SPONSORS-CROWN-MEDIA', 'logo_path' => 'images/sponsors/SPONSORS-CROWN-MEDIA.png'],
            ['name' => 'GANZI', 'logo_path' => 'images/sponsors/GANZI.png'],
            ['name' => 'jeziOriginal', 'logo_path' => 'images/sponsors/jeziOriginal.png'],
            ['name' => 'MAGARI', 'logo_path' => 'images/sponsors/MAGARI.png'],
            ['name' => 'SPONSORS-BAR', 'logo_path' => 'images/sponsors/SPONSORS-BAR.png'],
            ['name' => 'SPONSORS1', 'logo_path' => 'images/sponsors/SPONSORS1.png'],
            ['name' => 'simuhadhiYako', 'logo_path' => 'images/sponsors/simuhadhiYako.png'],
            ['name' => 'RAMA', 'logo_path' => 'images/sponsors/RAMA.png'],
            ['name' => 'SPONSORS-DOLLY', 'logo_path' => 'images/sponsors/SPONSORS-DOLLY.png'],
            ['name' => 'SPONSORS GAZEM', 'logo_path' => 'images/sponsors/SPONSORS-GAZEM.png'],
            ['name' => 'SPONSORS-jay', 'logo_path' => 'images/sponsors/SPONSORS-jay.png'],
            ['name' => 'SPONSORSkim', 'logo_path' => 'images/sponsors/SPONSORSkim.png'],
            ['name' => 'SPONSORS-STOCK', 'logo_path' => 'images/sponsors/SPONSORS-STOCK.png'],
            ['name' => 'MAKUNDUCHI', 'logo_path' => 'images/sponsors/MAKUNDUCHI.png'],
            ['name' => 'MQ', 'logo_path' => 'images/sponsors/MQ.png'],
            ['name' => 'NIVES TRENDS', 'logo_path' => 'images/sponsors/NIVES_TRENDS.png'],
            ['name' => 'PRO SHARE', 'logo_path' => 'images/sponsors/PRO-SHARE.png'],
            ['name' => 'mama viwanja', 'logo_path' => 'images/sponsors/mama-viwanja.png'],
        ];

        foreach ($seedSponsors as $index => $sponsor) {
            DB::table('sponsors')->insert(array_merge($sponsor, [
                'tier' => 'Supporter',
                'is_active' => true,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsors');
    }
};
