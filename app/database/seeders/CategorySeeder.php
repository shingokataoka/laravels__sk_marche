<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carbonObj = new Carbon();
        $nowDatetime = $carbonObj->format('Y-m-d H:i:s');

        DB::table('primary_categories')->insert([
            [
                'name' => '自転車',
                'sort_order' => 2,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'name' => 'キャンプ',
                'sort_order' => 1,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'name' => 'スノーボード',
                'sort_order' => 3,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
        ]);

        DB::table('secondary_categories')->insert([
            [
                'primary_category_id' => 1,
                'name' => 'ロードバイク',
                'sort_order' => 3,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 1,
                'name' => 'クロスバイク',
                'sort_order' => 2,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 1,
                'name' => 'マウンテンバイク',
                'sort_order' => 1,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 2,
                'name' => 'スノーピーク',
                'sort_order' => 1,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 2,
                'name' => 'コールマン',
                'sort_order' => 2,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 2,
                'name' => 'ロゴス',
                'sort_order' => 3,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 3,
                'name' => 'バードン',
                'sort_order' => 2,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 3,
                'name' => 'サロモン',
                'sort_order' => 3,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
            [
                'primary_category_id' => 3,
                'name' => 'ヘッド',
                'sort_order' => 1,
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ],
        ]);
    }
}
