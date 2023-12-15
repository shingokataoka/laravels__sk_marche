<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shop_id' => fake()->numberBetween(1,2),
            'secondary_category_id' => fake()->numberBetween(1,9),
            'image1' => fake()->numberBetween(1,40),
            'image2' => fake()->numberBetween(1,40),
            'image3' => fake()->numberBetween(1,40),
            'image4' => fake()->numberBetween(1,40),
            'name' => fake()->name,
            'information' => fake()->realText(),
            'price' => fake()->numberBetween(10, 100000),
            'is_selling' => fake()->boolean(),
            'sort_order' => fake()->unique()->randomNumber(),
            'created_at' => fake()->datetimeBetween('-5 year', 'now'),
            'updated_at' => fake()->datetimeBetween('-5 year', 'now'),
        ];
    }
}
