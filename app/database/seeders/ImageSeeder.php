<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carbonObj = new Carbon();
        $nowDatetime = $carbonObj->format('Y-m-d H:i:s');
        $rows = [];
        for($i = 1; $i <= 6; $i++) {
            $rows[] = [
                'owner_id' => 1,
                'filename' => "product{$i}.jpg",
                'title' => "商品画像{$i}",
                'created_at' => $nowDatetime,
                'created_at' => $nowDatetime,
            ];
        }
        DB::table('images')->insert($rows);
    }
}
