<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'awards@businessawards.co.tz'], // email ya kipekee
            [
                'name' => 'Admin User',
                'password' => Hash::make('awards@businessawards.co.tz'), // weka nenosiri lenye usalama
                'is_admin' => true, // hakikisha ni admin
                'email_verified_at' => now(),
            ]
        );
    }
}
