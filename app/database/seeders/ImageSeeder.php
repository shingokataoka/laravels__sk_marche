<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        for($i = 1; $i <= 40; $i++) {
            $filename = "product{$i}.jpg";
            // 画像ダミーが1〜10までだから、11以上は画像を複製してダミー画像を用意する。
            $dirPath = "products/images/";
            $oldI = ((string)$i)[-1];
            $oldFilePath = $dirPath . "product{$oldI}.jpg";
            $newFilePath = $dirPath . $filename;
            if ($i >= 10) Storage::copy($oldFilePath, $newFilePath);
            $rows[] = [
                'owner_id' => 1,
                'filename' => $filename,
                'title' => "商品画像{$i}",
                'created_at' => $nowDatetime,
                'created_at' => $nowDatetime,
            ];
        }

        DB::table('images')->insert($rows);
    }
}
