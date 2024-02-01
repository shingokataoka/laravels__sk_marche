<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDatetime = Carbon::now()->format('Y-m-d H:i:s');
        $insertRows = [];
        // オーナー「システム」を追加。id=1となる。
        $insertRows[] = [
            'name' => "system1",
            'email' => "system1@test.com",
            'password' => Hash::make("system1111"),
            'created_at' => $nowDatetime,
            'updated_at' => $nowDatetime,
            'deleted_at' => null,
        ];
        // オーナーダミーを追加。
        // shopに合わせるため、id2〜id30まで作る。
        // よって$iは1〜29までになる。
        for ($i=1; $i<=29; $i++) {
            $insertRows[] = [
                'name' => "owner{$i}",
                'email' => "owner{$i}@test.com",
                'password' => Hash::make("owner{$i}{$i}{$i}{$i}"),
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
                'deleted_at' => null,
            ];
        }
        DB::table('owners')->insert($insertRows);
    }
}
