<?php

namespace Database\Seeders;

use App\Models\SponsorshipPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SponsorshipPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Title Sponsor',
                'price' => 50000000,
                'price_formatted' => '50,000,000 TZS',
                'description' => 'The pinnacle of partnership, offering exclusive naming rights and unparalleled brand integration.',
                'is_popular' => true,
                'sort_order' => 1,
                'benefits' => [
                    'Exclusive naming rights as the Main Sponsor',
                    'Premium branding on all event materials',
                    'Recognition on our social platforms',
                    'Logo placement on award trophies & certificates.',
                    'Company listed prominently on our website with a direct link to your company',
                    'Recognition in all Event press releases, social media, and national media coverage.',
                    'Space for ad in our bulletin board on Event Day',
                    'Corporate banner (supplied by sponsor) hung at both ends',
                    'Promotion meeting discussion',
                    '50 complementary tickets for employees to attend the awards.',
                    'Priority choice of up to 3 award categories to sponsor and the same Awards presentation opportunity',
                    '10 minutes Opportunity to speak on Event Day',
                ]
            ],
            [
                'name' => 'Platinum Sponsor',
                'price' => 30000000,
                'price_formatted' => '30,000,000 TZS',
                'description' => 'A premium sponsorship level with high-impact visibility and significant promotional benefits.',
                'is_popular' => false,
                'sort_order' => 2,
                'benefits' => [
                    'Premium logo placement on event materials & media promotions.',
                    'Corporate banner (supplied by sponsor) hung at both ends',
                    'Space for ad in our bulletin board on Event Day',
                    'Recognition on our social platforms',
                    'Recognition on Event Day',
                    'Company listed prominently on our website with a direct link to your company',
                    '40 complementary tickets for employees to attend the awards.',
                    '2 Awards presentation opportunity',
                    'Recognition by MC during presentation of the award',
                    '5 minutes Opportunity to speak on Event Day',
                ]
            ],
            [
                'name' => 'Gold Sponsor',
                'price' => 20000000,
                'price_formatted' => '20,000,000 TZS',
                'description' => 'A major sponsorship package ensuring strong brand presence and recognition.',
                'is_popular' => false,
                'sort_order' => 3,
                'benefits' => [
                    'Logo on event backdrop & program booklet',
                    'Recognized on Event Day',
                    'Recognition on our social platforms',
                    'Company listed prominently on our website with a direct link to your company',
                    'Space for ad in our bulletin board on Event Day',
                    'Company promoted throughout duration of the week before Event',
                    '30 complementary tickets for employees to attend the awards.',
                    'Recognition by MC during presentation of the award',
                    '1 Award presentation opportunity',
                    '3 minutes speaking slot at the ceremony',
                ]
            ],
            [
                'name' => 'Silver Sponsor',
                'price' => 10000000,
                'price_formatted' => '10,000,000 TZS',
                'description' => 'A valuable package for supporters looking for significant brand exposure.',
                'is_popular' => false,
                'sort_order' => 4,
                'benefits' => [
                    'Recognition on our social platforms',
                    'Space for ad on our bulletin board on Event Day',
                    'Company listed prominently on our website with a direct link to your company',
                    '20 complementary tickets for employees to attend the awards.',
                    'Recognition by MC during presentation of the award',
                    '1 Award presentation opportunity',
                    '2 minutes speaking slot at the ceremony',
                ]
            ],
            [
                'name' => 'Category Sponsor',
                'price' => 5000000,
                'price_formatted' => '5,000,000 TZS',
                'description' => 'Associate your brand with a specific award category for targeted recognition.',
                'is_popular' => false,
                'sort_order' => 5,
                'benefits' => [
                    'Naming rights for one specific award category',
                    'Logo on stage screen and program booklet during category announcement.',
                    'Recognition by MC during presentation of the award',
                    'Recognition on our social platforms',
                    'Business logo ad for company',
                    '10 complimentary tickets for employees',
                    'Sponsored category Award presentation opportunity',
                    '1 minute speaking slot at the ceremony',
                ]
            ],
            [
                'name' => 'Support Sponsor',
                'price' => 3000000,
                'price_formatted' => '3,000,000 TZS',
                'description' => 'Show your support for the healthcare community and gain valuable brand mention.',
                'is_popular' => false,
                'sort_order' => 6,
                'benefits' => [
                    'Logo on shared appreciation banner.',
                    'Mention on social media as a supporting partner.',
                    '5 complementary tickets for employees to attend the awards.',
                ]
            ],
        ];

        foreach ($packages as $pkg) {
            SponsorshipPackage::updateOrCreate(
                ['slug' => Str::slug($pkg['name'])],
                [
                    'name' => $pkg['name'],
                    'price' => $pkg['price'],
                    'price_formatted' => $pkg['price_formatted'],
                    'description' => $pkg['description'],
                    'benefits' => $pkg['benefits'],
                    'is_popular' => $pkg['is_popular'],
                    'sort_order' => $pkg['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
