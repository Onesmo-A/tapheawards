<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Nominee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seed data: TAPHE 2026 Award Categories + Nominees
 * Hii seeder inafanya kazi hata kama migrate:fresh imefanyika.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Futa data zote zilizopo
        Nominee::query()->delete();
        Category::query()->delete();
        CategoryGroup::query()->delete();

        $data = [
            // ══════════════════════════════════════════════════
            // A. INSTITUTIONAL EXCELLENCE AWARDS
            // ══════════════════════════════════════════════════
            'A. INSTITUTIONAL EXCELLENCE AWARDS' => [
                'Best Hospital of The Year - Private' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [
                        'Aga Khan Hospital', 'Saifee Hospital', 'Kitengule Hospital',
                        'Rabininsia Memorial Hospital', 'TMJ Hospital', 'Kairuki Hospital',
                        'Hindu Mandal Hospital', 'Apollo Hospital', 'Shifa International Hospital',
                        'Bochi Hospital', 'Hitech Sai Hospital', 'Regency Hospital',
                    ],
                ],
                'Best Hospital of the Year - Public' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Outstanding Hospital of The Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 500000,
                    'nominees' => [
                        'Muhimbili National Hospital', 'Bugando Hospital', 'Benjamin Mkapa Hospital',
                    ],
                ],
                'Best Ambulance Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Diagnostic Centre of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Community/Retail Pharmacy of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Pharmaceutical Company of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 500000,
                    'nominees' => [],
                ],
                'Best Pharmaceutical Wholesaler of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Health Insurance Company of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 500000,
                    'nominees' => [],
                ],
            ],

            // ══════════════════════════════════════════════════
            // B. SPECIALIZED HEALTHCARE SERVICES AWARDS
            // ══════════════════════════════════════════════════
            'B. SPECIALIZED HEALTHCARE SERVICES AWARDS' => [
                'Best Cardiology Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [
                        'Jakaya Kikwete Cardiac Institute', 'Aga Khan Hospital',
                    ],
                ],
                'Best Physiotherapy and Rehabilitation Service provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [
                        'CCBRT', 'MOI', 'Kairuki Rehab Unit',
                    ],
                ],
                'Best Radiology & Imaging Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Laboratory & Diagnostic Services Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Dental Services Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best OBGY Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Ophthalmology (Eye Care) Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best Orthopedic Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Blood Bank Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Best ENT (Ear, Nose & Throat) Service Provider of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
            ],

            // ══════════════════════════════════════════════════
            // C. HOSPITAL DEPARTMENT AWARDS
            // ══════════════════════════════════════════════════
            'C. HOSPITAL DEPARTMENT AWARDS' => [
                'Best Emergency Department of The Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [
                        'The Aga Khan Hospital', 'Saifee Hospital', 'Rabininsia Memorial Hospital',
                        'Kitengule Hospital', 'TMJ Hospital', 'Kairuki Hospital',
                        'Bochi Hospital Limited', 'Muhimbili National Hospital',
                        'Mwananyamala Regional Referral Hospital', 'Muhimbili - Mloganzila',
                    ],
                ],
                'Best Outpatient Department (OPD) of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Dental Department of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Eye Care Unit Department of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Pediatric Department of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Surgical Department of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
                'Best Health Records and ICT Department' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Excellence in Best patient experience inpatient Care' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 200000,
                    'nominees' => [],
                ],
            ],

            // ══════════════════════════════════════════════════
            // D. INDIVIDUAL EXCELLENCE AWARDS
            // ══════════════════════════════════════════════════
            'D. INDIVIDUAL EXCELLENCE AWARDS' => [
                'Best Doctor of the Year – Private Hospital' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [
                        'Dr Crala Damascene Makatu', 'Dr. Sophia Otaru', 'Cynthia Christopher Kajuna',
                    ],
                ],
                'Best Doctor of the Year – Public Hospital' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Surgeon of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => ['Dr Walter Kweka'],
                ],
                'Best Nurse of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Mental Health Specialist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => ['Sofia Samson Sanga', 'Dr Praxeda Swai'],
                ],
                'Best Pediatrician of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Gynecologist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Dermatologist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Pharmacist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Laboratory Technician of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Nutritionist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Physiotherapist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Anesthesiologist of the year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best ENT Specialist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Orthopedist of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Oncologist of the year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Physician of the Year' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
            ],

            // ══════════════════════════════════════════════════
            // E. LEADERSHIP & INNOVATION AWARDS
            // ══════════════════════════════════════════════════
            'E. LEADERSHIP & INNOVATION AWARDS' => [
                'Best Health Innovator' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Leadership in Health Sector' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Outstanding Woman in Health' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Best Use of Technology in Healthcare' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
                'Emerging Health Professional (Under 35 Years)' => [
                    'status' => 'active', 'voting_enabled' => true, 'nomination_fee' => 100000,
                    'nominees' => [],
                ],
            ],

            // ══════════════════════════════════════════════════
            // F. LIFETIME & HONORARY AWARDS
            // ══════════════════════════════════════════════════
            'F. LIFETIME & HONORARY AWARDS' => [
                'Lifetime Achievement in Healthcare' => [
                    'status' => 'active', 'voting_enabled' => false, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
                'Outstanding Media Contribution to healthcare' => [
                    'status' => 'active', 'voting_enabled' => false, 'nomination_fee' => 0,
                    'nominees' => [],
                ],
            ],
        ];

        $totalCategories = 0;
        $totalNominees = 0;

        foreach ($data as $groupName => $categories) {
            $group = CategoryGroup::create([
                'name'   => $groupName,
                'slug'   => Str::slug($groupName),
                'status' => 'active',
            ]);

            foreach ($categories as $categoryName => $config) {
                $category = Category::create([
                    'category_group_id' => $group->id,
                    'name'              => $categoryName,
                    'slug'              => Str::slug($categoryName),
                    'status'            => $config['status'],
                    'voting_enabled'    => $config['voting_enabled'],
                    'nomination_fee'    => $config['nomination_fee'],
                ]);
                $totalCategories++;

                foreach ($config['nominees'] as $nomineeName) {
                    Nominee::create([
                        'category_id'  => $category->id,
                        'name'         => $nomineeName,
                        'bio'          => null,
                        'votes_count'  => 0,
                        'is_suspended' => false,
                    ]);
                    $totalNominees++;
                }
            }
        }

        $this->command->info("✅ Groups: " . count($data) . " | Categories: {$totalCategories} | Nominees: {$totalNominees}");
    }
}
