<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDate = Carbon::now()->format('Y-m-d H:i:s');

        $rows = [];
        for ($i=1; $i<=4; $i++) {
            $rows[] = [
                'shop_id' => 1,
                'secondary_category_id' => $i,
                'image1' => $i,
                'name' => "商品{$i}",
                'information' => "商品の説明文{$i}。" .PHP_EOL. "商品の説明文{$i}。",
                'price' => $i * 1000,
                'is_selling' => ($i + 1) % 2,
                'sort_order' => 5 - $i,
                'created_at' => $nowDate,
                'updated_at' => $nowDate,
            ];
        }
        DB::table('products')->insert($rows);
    }
}
