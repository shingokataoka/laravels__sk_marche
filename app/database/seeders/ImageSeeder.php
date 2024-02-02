<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carbonObj = new Carbon();
        $nowDatetime = $carbonObj->format('Y-m-d H:i:s');

        // storage内のproducts内のimagesごとファイルを消す。
        Storage::deleteDirectory('products/images');
        // products/imagesフォルダを作成する。
        Storage::makeDirectory('products/images');
        // 所有者と所有グループを修正。
        $username = 'vpsuser';
        chown( Storage::path('products') , $username);
        chgrp( Storage::path('products') , 'www-data');
        chown( Storage::path('products/images') , $username);
        chgrp( Storage::path('products/images') , 'www-data');

        // まず、storage内にproducts系画像を用意する。
        // 「アプリ直下/dummy_data」内からproducts系の画像一覧をstorage内にコピペする。
        $dummyDir = 'dummy_data/storage/public/products/images/';
        $storageDir = Storage::path('products/images/');
        // product0〜9.jpgをstorageのproductsにコピペする。
        for($i=0; $i<=9; $i++) {
            $filename = "product{$i}.jpg";
            $dummyPath = $dummyDir . $filename;
            $newPath = $storageDir . $filename;
            File::copy($dummyPath, $newPath);
        }
        // この0〜9の画像をコピペして40まで増やす。
        for($i = 10; $i <= 40; $i++) {
            $filename = "product{$i}.jpg";
            // 画像ダミーが1〜10までだから、11以上は画像を複製してダミー画像を用意する。
            $dirPath = "products/images/";
            $oldI = ((string)$i)[-1];
            $oldFilePath = $dirPath . "product{$oldI}.jpg";
            $newFilePath = $dirPath . $filename;
            Storage::copy($oldFilePath, $newFilePath);
        }

        // この画像一覧の所有者と所有グループを修正。
        $imageFiles = Storage::files('products/images');
        foreach ($imageFiles as $imageFile) {
            $imagePath = Storage::path(  $imageFile );
            chown($imagePath, $username);
            chgrp($imagePath, 'www-data');
        }

        // insert用の配列を用意。
        $rows = [];
        for($i = 1; $i <= 40; $i++) {
            $rows[] = [
                // owner1のid。
                'owner_id' => 2,
                'filename' => "product{$i}.jpg",
                'title' => "商品画像{$i}",
                'created_at' => $nowDatetime,
                'created_at' => $nowDatetime,
            ];
        }
        // insert実行。
        DB::table('images')->insert($rows);
    }
}
