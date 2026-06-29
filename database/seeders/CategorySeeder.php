<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Futa data zote zilizopo ili kuanza upya
        Category::query()->delete();

        $awardGroups = [
            "A. DEPARTMENT-BASED AWARDS" => [
                "Best Outpatient Department (OPD) of the Year",
                "Best Inpatient Care Unit of the Year",
                "Best Emergency Medical Services Provider",
                "Best Surgical Department",
                "Best Maternal and Child Health Unit",
                "Best Pediatric Services Department",
                "Best Dental Care Department",
                "Best Eye Care Unit",
            ],
            "B. INDIVIDUAL PROFESSIONAL EXCELLENCE AWARDS" => [
                "Best Doctor of the Year – Public Hospital",
                "Best Doctor of the Year – Private Hospital",
                "Best Nurse of the Year",
                "Best Clinical Officer of the Year",
                "Best Dermatologist of the Year",
                "Best Pharmacist of the Year",
                "Best Laboratory Technologist of the Year",
                "Best Nutritionist of the Year",
                "Best Mental Health Specialist of the Year",
                "Best Pediatrician of the Year",
                "Best Gynecologist of the Year",
                "Best Physiotherapist of the Year",
            ],
            "C. SPECIALIZED SERVICES AND SUPPORT AWARDS" => [
                "Best Medical Laboratory Services Provider",
                "Best Radiology and Diagnostic Services Department",
                "Best Pharmaceutical Services Unit",
                "Best Physiotherapy and Rehabilitation Center",
                "Best Health Records and ICT Department",
            ],
            "D. INSTITUTIONAL AND COMMUNITY IMPACT AWARDS" => [
                "Best Pharmaceutical Company of the Year",
                "Best Health Insurance Company of the Year",
            ],
            "E. LEADERSHIP AND INNOVATION AWARDS" => [
                "Best Health Innovator",
                "Best Use of Technology in Healthcare",
                "Best Leadership in Health Sector",
                "Outstanding Woman in Health",
                "Emerging Health Professional (Under 35 Years)",
            ],
        ];

        foreach ($awardGroups as $groupName => $awards) {
            $parentCategory = Category::create([
                'name' => $groupName,
                'slug' => Str::slug($groupName),
                'parent_id' => null,
            ]);

            foreach ($awards as $awardName) {
                Category::create([
                    'name' => $awardName,
                    'slug' => Str::slug($awardName),
                    'parent_id' => $parentCategory->id,
                ]);
            }
        }
    }
}
