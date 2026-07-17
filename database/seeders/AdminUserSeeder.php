<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        AdminUser::updateOrCreate(
            ['email' => 'info@tapheawards.co.tz'],
            [
                'name' => 'TAPHE Secretariat Admin',
                'phone' => '255749562993',
                'password' => Hash::make('secretariat@taphe'),
                'role' => 'super_admin',
                'is_active' => true,
            ]
        );
    }
}
