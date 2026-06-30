<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_banners', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('eyebrow')->nullable();
            $table->string('badge')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('primary_button_text')->nullable();
            $table->string('primary_button_url')->nullable();
            $table->string('secondary_button_text')->nullable();
            $table->string('secondary_button_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $settings = collect(
            DB::table('settings')
                ->whereIn('key', [
                    'hero_slide_1_image',
                    'hero_slide_2_image',
                    'hero_slide_3_image',
                    'hero_slide_4_image',
                ])
                ->pluck('value', 'key')
        );

        $now = now();

        DB::table('hero_banners')->insert([
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'eyebrow' => 'Official TAPHE Awards',
                'badge' => 'Slide 01',
                'title' => 'Tanzania People\'s Health Excellence Awards',
                'description' => 'Honoring outstanding healthcare providers, hospitals, and institutions across Tanzania.',
                'image_path' => $settings->get('hero_slide_1_image', 'images/hero/slide-1.png'),
                'primary_button_text' => 'Vote Now',
                'primary_button_url' => '/categories',
                'secondary_button_text' => 'View Winners',
                'secondary_button_url' => '/awards',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'eyebrow' => 'Healthcare Heroes',
                'badge' => 'Slide 02',
                'title' => 'Vote for Your Health Heroes',
                'description' => 'Support doctors, nurses, and healthcare facilities making a difference in our communities.',
                'image_path' => $settings->get('hero_slide_2_image', 'images/hero/slide-2.png'),
                'primary_button_text' => 'Cast Your Vote',
                'primary_button_url' => '/categories',
                'secondary_button_text' => 'See Nominees',
                'secondary_button_url' => '/awards',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'eyebrow' => 'Impact & Innovation',
                'badge' => 'Slide 03',
                'title' => 'Innovation, Positive Impact, Integrity',
                'description' => 'Recognizing innovation, positive impact, and integrity in healthcare leadership and service delivery.',
                'image_path' => $settings->get('hero_slide_3_image', 'images/hero/slide-3.png'),
                'primary_button_text' => 'Suggest Nominee',
                'primary_button_url' => '/suggest-nominee',
                'secondary_button_text' => 'More About TAPHE',
                'secondary_button_url' => '/about',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'eyebrow' => 'Join the Celebration',
                'badge' => 'Slide 04',
                'title' => 'Celebrate the People Transforming Healthcare',
                'description' => 'Be part of the national awards event celebrating Tanzania healthcare champions.',
                'image_path' => $settings->get('hero_slide_4_image', 'images/hero/slide-4.png'),
                'primary_button_text' => 'Register for Marathon',
                'primary_button_url' => '/marathon/register',
                'secondary_button_text' => 'See Past Winners',
                'secondary_button_url' => '/awards',
                'sort_order' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_banners');
    }
};
