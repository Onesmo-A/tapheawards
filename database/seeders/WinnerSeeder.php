<?php

namespace Database\Seeders;

use App\Models\Winner;
use App\Models\Nominee;
use Illuminate\Database\Seeder;

class WinnerSeeder extends Seeder
{
    public function run(): void
    {
        // Check if winners already exist
        if (Winner::count() > 0) {
            $this->command->info('Winners already exist. Skipping seeding...');
            return;
        }

        // Get existing nominees
        $nominees = Nominee::all();

        if ($nominees->isEmpty()) {
            $this->command->error('No nominees found. Cannot create winners.');
            return;
        }

        // Create winners from existing nominees
        foreach ($nominees->take(5) as $nominee) {
            Winner::create([
                'nominee_id' => $nominee->id,
                'category_id' => $nominee->category_id,
                'year' => date('Y'),
                'position' => rand(1, 3),
                'award_ceremony_date' => now(),
                'description' => "Winner in {$nominee->category->name} category"
            ]);
        }

        $this->command->info('Winners created successfully!');
    }
}