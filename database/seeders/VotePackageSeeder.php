<?php

namespace Database\Seeders;

use App\Models\VotePackage;
use Illuminate\Database\Seeder;

class VotePackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'votes' => 1,
                'price' => 500,
                'label' => '1 Vote',
                'sub' => 'Single test vote',
                'sort_order' => 1,
            ],
            [
                'votes' => 3,
                'price' => 1000,
                'label' => '3 Votes',
                'sub' => 'Bronze Package',
                'sort_order' => 2,
            ],
            [
                'votes' => 6,
                'price' => 5000,
                'label' => '6 Votes',
                'sub' => 'Silver Package',
                'sort_order' => 3,
            ],
            [
                'votes' => 15,
                'price' => 10000,
                'label' => '15 Votes',
                'sub' => 'Gold Package',
                'sort_order' => 4,
            ],
            [
                'votes' => 25,
                'price' => 20000,
                'label' => '25 Votes',
                'sub' => 'Platinum Package',
                'sort_order' => 5,
            ],
            [
                'votes' => 55,
                'price' => 40000,
                'label' => '55 Votes',
                'sub' => 'Diamond Package',
                'sort_order' => 6,
            ],
        ];

        foreach ($packages as $pkg) {
            VotePackage::updateOrCreate(
                ['votes' => $pkg['votes']],
                $pkg
            );
        }
    }
}
