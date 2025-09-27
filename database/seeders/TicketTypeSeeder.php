<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TicketType;

class TicketTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TicketType::updateOrCreate(
            ['name' => 'Regular Ticket'],
            [
                'description' => 'Access to the main event hall and standard seating.',
                'price' => 100000.00,
                'is_active' => true,
            ]
        );

        TicketType::updateOrCreate(
            ['name' => 'VIP Ticket'],
            [
                'description' => 'Priority seating, access to the VIP lounge, and complimentary drinks.',
                'price' => 250000.00,
                'is_active' => true,
            ]
        );

        TicketType::updateOrCreate(
            ['name' => 'VVIP Table (10 Pax)'],
            [
                'description' => 'A dedicated table for 10 guests with premium service, champagne, and exclusive networking opportunities.',
                'price' => 2500000.00,
                'is_active' => true,
            ]
        );
    }
}
