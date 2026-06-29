<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Nominee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NomineeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techCategory = Category::where('slug', 'best-tech-startup')->first();
        $entrepreneurCategory = Category::where('slug', 'entrepreneur-of-the-year')->first();
        $customerServiceCategory = Category::where('slug', 'customer-service-excellence')->first();
        $sustainableCategory = Category::where('slug', 'sustainable-business-award')->first();

        Nominee::create([
            'category_id' => $techCategory->id,
            'name' => 'Innovate Solutions Ltd.',
            'bio' => 'Leading the way in AI-driven business solutions for the Tanzanian market.',
            'image_path' => 'images/nominees/innovate.jpg',
        ]);
        Nominee::create([
            'category_id' => $techCategory->id,
            'name' => 'Nala Money',
            'bio' => 'Simplifying payments and financial services across Africa.',
            'image_path' => 'images/nominees/nala.jpg',
        ]);
        Nominee::create([
            'category_id' => $techCategory->id,
            'name' => 'Shule Direct',
            'bio' => 'Providing digital learning content for secondary school students.',
            'image_path' => 'images/nominees/shule.jpg',
        ]);
        Nominee::create([
            'category_id' => $techCategory->id,
            'name' => 'Jaza Energy',
            'bio' => 'Affordable and accessible solar energy solutions for rural communities.',
            'image_path' => 'images/nominees/jaza.jpg',
        ]);
        Nominee::create([
            'category_id' => $techCategory->id,
            'name' => 'Kwanza Hub',
            'bio' => 'A leading innovation hub fostering the tech ecosystem in Tanzania.',
            'image_path' => 'images/nominees/kwanza.jpg',
        ]);
        Nominee::create([
            'category_id' => $entrepreneurCategory->id,
            'name' => 'Aisha Juma',
            'bio' => 'Founder of "Green Harvest Farms", promoting organic farming.',
            'image_path' => 'images/nominees/aisha.jpeg',
        ]);
        Nominee::create([
            'category_id' => $entrepreneurCategory->id,
            'name' => 'David Mushi',
            'bio' => 'CEO of "Pamoja Cabs", a fast-growing ride-hailing service.',
            'image_path' => 'images/nominees/david.jpg',
        ]);
        Nominee::create([
            'category_id' => $customerServiceCategory->id,
            'name' => 'Service First Co.',
            'bio' => 'Dedicated to unparalleled customer satisfaction.',
            'image_path' => 'images/nominees/service.jpg',
        ]);
        Nominee::create([
            'category_id' => $customerServiceCategory->id,
            'name' => 'The Coffee House',
            'bio' => 'Known for its friendly staff and exceptional coffee experience.',
            'image_path' => 'images/nominees/coffee.jpg',
        ]);
        Nominee::create([
            'category_id' => $sustainableCategory->id,
            'name' => 'Eco-Bana',
            'bio' => 'Turning banana peels into biodegradable packaging materials.',
            'image_path' => 'images/nominees/eco.jpg',
        ]);
        Nominee::create([
            'category_id' => $sustainableCategory->id,
            'name' => 'Dunia Designs',
            'bio' => 'Creating beautiful furniture from recycled plastic waste.',
            'image_path' => 'images/nominees/dunia.jpg',
        ]);
    }
}
