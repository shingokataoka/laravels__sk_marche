<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Product;
use Carbon\Carbon;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nowDatetime = Carbon::parse()->format('Y-m-d H:i:s');
        return [
            'product_id' => Product::factory(),
            'type' => fake()->boolean(),
            'quantity' => fake()->NumberBetween(1,99),
            'created_at' => $nowDatetime,
            'updated_at' => $nowDatetime,
        ];
    }
}
