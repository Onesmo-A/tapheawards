<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Nominee;
use Illuminate\Database\Seeder;

class NomineeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Inatafuta categories kwa jina (case-insensitive LIKE) ili ioanane na DB yoyote.
     */
    public function run(): void
    {
        // Futa data zote zilizopo za washiriki
        Nominee::query()->delete();

        // Mapping: jina la nominee => sehemu ya jina la category (ya kutafuta kwa LIKE)
        $nomineesData = [
            // BEST HOSPITAL OF THE YEAR - PRIVATE
            ['name' => 'Aga Khan Hospital',                       'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Saifee Hospital',                         'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Kitengule Hospital',                      'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Rabininsia Memorial Hospital',            'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'TMJ Hospital',                            'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Kairuki Hospital',                        'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Hindu Mandal Hospital',                   'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Apollo Hospital',                         'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Shifa International Hospital',            'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Bochi Hospital',                          'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Hitech Sai Hospital',                     'category_search' => 'Best Hospital of The Year - Private'],
            ['name' => 'Regency Hospital',                        'category_search' => 'Best Hospital of The Year - Private'],

            // BEST EMERGENCY DEPARTMENT OF THE YEAR
            ['name' => 'The Aga Khan Hospital',                   'category_search' => 'Best Emergency Department'],
            ['name' => 'Saifee Hospital',                         'category_search' => 'Best Emergency Department'],
            ['name' => 'Rabininsia Memorial Hospital',            'category_search' => 'Best Emergency Department'],
            ['name' => 'Kitengule Hospital',                      'category_search' => 'Best Emergency Department'],
            ['name' => 'TMJ Hospital',                            'category_search' => 'Best Emergency Department'],
            ['name' => 'Kairuki Hospital',                        'category_search' => 'Best Emergency Department'],
            ['name' => 'Bochi Hospital Limited',                  'category_search' => 'Best Emergency Department'],
            ['name' => 'Muhimbili National Hospital',             'category_search' => 'Best Emergency Department'],
            ['name' => 'Mwananyamala Regional Referral Hospital', 'category_search' => 'Best Emergency Department'],
            ['name' => 'Muhimbili - Mloganzila',                  'category_search' => 'Best Emergency Department'],

            // BEST CARDIOLOGY
            ['name' => 'Jakaya Kikwete Cardiac Institute',        'category_search' => 'Cardiology'],
            ['name' => 'Aga Khan Hospital',                       'category_search' => 'Cardiology'],

            // BEST PHYSIOTHERAPY AND REHABILITATION
            ['name' => 'CCBRT',                                   'category_search' => 'Physiotherapy and Rehabilitation'],
            ['name' => 'MOI',                                     'category_search' => 'Physiotherapy and Rehabilitation'],
            ['name' => 'Kairuki Rehab Unit',                      'category_search' => 'Physiotherapy and Rehabilitation'],

            // OUTSTANDING HOSPITAL OF THE YEAR
            ['name' => 'Muhimbili National Hospital',             'category_search' => 'Outstanding Hospital'],
            ['name' => 'Bugando Hospital',                        'category_search' => 'Outstanding Hospital'],
            ['name' => 'Benjamin Mkapa Hospital',                 'category_search' => 'Outstanding Hospital'],

            // BEST MENTAL HEALTH SPECIALIST
            ['name' => 'Sofia Samson Sanga',                      'category_search' => 'Mental Health Specialist'],
            ['name' => 'Dr Praxeda Swai',                         'category_search' => 'Mental Health Specialist'],

            // BEST DOCTOR OF THE YEAR – PRIVATE HOSPITAL
            ['name' => 'Dr Crala Damascene Makatu',               'category_search' => 'Best Doctor of the Year – Private'],
            ['name' => 'Dr. Sophia Otaru',                        'category_search' => 'Best Doctor of the Year – Private'],
            ['name' => 'Cynthia Christopher Kajuna',              'category_search' => 'Best Doctor of the Year – Private'],

            // BEST SURGEON OF THE YEAR
            ['name' => 'Dr Walter Kweka',                         'category_search' => 'Best Surgeon'],
        ];

        // Cache ya categories kwa ufanisi
        $categoryCache = [];
        $created = 0;
        $skipped = 0;

        foreach ($nomineesData as $data) {
            $search = $data['category_search'];

            if (!isset($categoryCache[$search])) {
                $categoryCache[$search] = Category::where('name', 'LIKE', "%{$search}%")->first();
            }

            $category = $categoryCache[$search];

            if (!$category) {
                $this->command->warn("Category not found: '{$search}' (nominee: {$data['name']})");
                $skipped++;
                continue;
            }

            Nominee::firstOrCreate(
                [
                    'category_id' => $category->id,
                    'name'        => $data['name'],
                ],
                [
                    'bio'         => $data['bio'] ?? null,
                    'votes_count' => 0,
                    'is_suspended' => false,
                ]
            );
            $created++;
        }

        $this->command->info("✅ Nominees {$created} wamesajiliwa, {$skipped} walirukwa (category haikupatikana).");
    }
}
