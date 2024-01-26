<?php
namespace App\Services;

use App\Models\Product;

class SystemService
{
    // 商品「送料」のProductモデルインスタンスを返す。
    public static function getPostage()
    {
        return Product::find(1);
    }
}
