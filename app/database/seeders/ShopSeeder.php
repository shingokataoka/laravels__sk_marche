<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDate = Carbon::parse()->format('Y-m-d H:i:s');

        // storage内のshops/imagesごとの古いファイルを全て消す。
        Storage::deleteDirectory('shops/images');
        // 消したimagesフォルダを作り直す。
        Storage::makeDirectory('shops/images');
        // 所有者と所有グループを修正。
        $username = 'username';
        chown( Storage::path('shops'), $username );
        chown( Storage::path('shops/images'), $username );
        chgrp( Storage::path('shops'), 'www-data' );
        chgrp( Storage::path('shops/images'), 'www-data' );
        chmod( Storage::path('shops'), 0775 );
        chmod( Storage::path('shops/images'), 0775 );

        // まず「アプリフォルダ/dummy_data」からshop系画像をstorageにコピペする。
        $dummyDir = 'dummy_data/storage/public/shops/images/';
        $newDir = Storage::path('shops/images/');
        for($i=1; $i<=3; $i++) {
            $filename = "shop{$i}.jpg";
            $dummyPath = $dummyDir . $filename;
            $newPath = $newDir . $filename;
            File::copy($dummyPath, $newPath);
        }
        // この画像一覧の権限を修正。
        $imageFiles = Storage::files('shops/images');
        foreach ($imageFiles as $imageFile) {
            $imagePath = Storage::path($imageFile);
            chown($imagePath, $username);
            chgrp($imagePath, 'www-data');
            chmod($imagePath, 0664);
        }

        $rows = [];
        // システムをデータ的にはお店として追加。
        $rows[] = [
            'owner_id' => 1,
            'name' => 'システム',
            'information' => '例えばデータ的には商品「送料」などがこれの管理下になりまう。',
            'filename' => "shop1.jpg",
            'is_selling' => false,
            'created_at' => $nowDate,
            'updated_at' => $nowDate,
        ];
        // ダミーの店舗を追加。
        for ($i=2; $i<=30; $i++) {
            $rows[] = [
                'owner_id' => $i,
                'name' => 'ここにショップ名が入ります。',
                'information' => 'ここにお店の情報が入ります。',
                'filename' => "shop{$i}.jpg",
                'is_selling' => true,
                'created_at' => $nowDate,
                'updated_at' => $nowDate,
            ];
        }
        DB::table('shops')->insert($rows);
    }
}
