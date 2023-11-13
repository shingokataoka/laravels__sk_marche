<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nowDatetime = Carbon::parse()->format('Y-m-d H:i:s');
        // product_id=1 type=1 quantity=5,2
        $rows = [];
        foreach ([5, 2] as $quantity) {
            $rows[] = [
                'product_id' => 1,
                'type' => 1,
                'quantity' => $quantity,
            ];
        }
        DB::table('t_stocks')->insert($rows);
    }
}
