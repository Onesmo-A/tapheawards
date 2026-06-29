<?php

namespace Database\Factories;

use App\Models\Winner;
use App\Models\Nominee;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class WinnerFactory extends Factory
{
    protected $model = Winner::class;

    public function definition(): array
    {
        return [
            'nominee_id' => Nominee::factory(),
            'category_id' => Category::factory(),
            'year' => $this->faker->year(),
            'position' => $this->faker->numberBetween(1, 3),
            'award_ceremony_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'description' => $this->faker->paragraph()
        ];
    }
}