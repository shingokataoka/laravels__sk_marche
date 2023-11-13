<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product;
use App\Models\Stock;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserSeeder::class,
            AdminSeeder::class,
            OwnerSeeder::class,
            CategorySeeder::class,
            ImageSeeder::class,
            ShopSeeder::class,
            ProductSeeder::class,
            StockSeeder::class,
        ]);

        Product::factory(10)->create();
        Stock::factory(1000)->create();

    }
}
