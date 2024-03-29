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
        // データ的には商品「送料」などを追加する。
        $rows[] = [
            'shop_id' => 1,    // 店舗「システム」のID
            'secondary_category_id' => 1,
            'image1' => null,
            'name' => "送料",
            'information' => "送料、国内一律550円（税込）です。",
            'price' => 550,
            'is_selling' => 0,
            'sort_order' => 9999999999,
            'created_at' => $nowDate,
            'updated_at' => $nowDate,
        ];
        // ダミー商品を追加。
        for ($i=1; $i<=4; $i++) {
            $rows[] = [
                'shop_id' => 2,
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

        // ソフトデリートされたダミー商品を追加。
        $rows = [];
        for ($i=1; $i<720; $i++) {
            $rows[] = [
                'shop_id' => mt_rand(2,3),
                'secondary_category_id' => mt_rand(1,9),
                'image1' => mt_rand(1,40),
                'name' => "削除した " . fake()->name,
                'information' => "商品の説明文{$i}。" .PHP_EOL. "削除した商品の説明文{$i}。",
                'price' => mt_rand(1, 999999),
                'is_selling' => fake()->boolean(),
                'sort_order' => fake()->unique()->randomNumber(),
                'created_at' => fake()->datetimeBetween('-5 year', 'now'),
                'updated_at' => fake()->datetimeBetween('-5 year', 'now'),
                'deleted_at' => fake()->datetimeBetween('-5 year', 'now'),
            ];
        }
        DB::table('products')->insert($rows);
    }
}
