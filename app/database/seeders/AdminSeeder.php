<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDatetime = Carbon::now()->format('Y-m-d H:i:s');
        $insertRows = [];
        for ($i=1; $i<=5; $i++) {
            $insertRows[] = [
                'name' => "admin{$i}",
                'email' => "admin{$i}@test.com",
                'password' => Hash::make("admin{$i}{$i}{$i}{$i}"),
                'created_at' => $nowDatetime,
                'updated_at' => $nowDatetime,
            ];
        }
        DB::table('admins')->insert($insertRows);
    }
}
