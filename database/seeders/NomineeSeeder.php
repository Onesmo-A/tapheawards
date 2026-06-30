<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Nominee;
use Illuminate\Database\Seeder;

class NomineeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Futa data zote zilizopo za washiriki
        Nominee::query()->delete();

        $opdCategory = Category::where('slug', 'best-outpatient-department-opd-of-the-year')->first();
        $doctorPublicCategory = Category::where('slug', 'best-doctor-of-the-year-public-hospital')->first();
        $nurseCategory = Category::where('slug', 'best-nurse-of-the-year')->first();

        if ($opdCategory) {
            Nominee::create([
                'category_id' => $opdCategory->id,
                'name' => 'Muhimbili National Hospital OPD',
                'bio' => 'Serving thousands of patients daily with excellent triage and care systems.',
                'votes_count' => 0,
            ]);
            Nominee::create([
                'category_id' => $opdCategory->id,
                'name' => 'Aga Khan Hospital OPD',
                'bio' => 'Renowned outpatient medical care with modern facilities.',
                'votes_count' => 0,
            ]);
        }

        if ($doctorPublicCategory) {
            Nominee::create([
                'category_id' => $doctorPublicCategory->id,
                'name' => 'Dr. Onesmo A. Kibona',
                'bio' => 'Outstanding surgeon dedicated to public health campaigns and local clinic mentorship.',
                'votes_count' => 0,
            ]);
            Nominee::create([
                'category_id' => $doctorPublicCategory->id,
                'name' => 'Dr. Upendo Shayo',
                'bio' => 'Leading pediatric physician specializing in neonatal care in public hospitals.',
                'votes_count' => 0,
            ]);
        }

        if ($nurseCategory) {
            Nominee::create([
                'category_id' => $nurseCategory->id,
                'name' => 'Nurse Mary Lwakatare',
                'bio' => 'Compassionate care worker with over 15 years of dedicated community service.',
                'votes_count' => 0,
            ]);
            Nominee::create([
                'category_id' => $nurseCategory->id,
                'name' => 'Nurse Grace Mushi',
                'bio' => 'Pioneer in promoting hygiene and child nutrition education.',
                'votes_count' => 0,
            ]);
        }
    }
}
