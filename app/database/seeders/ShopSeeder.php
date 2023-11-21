<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDate = Carbon::parse()->format('Y-m-d H:i:s');

        $rows = [];
        for ($i=1; $i<=30; $i++) {
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
