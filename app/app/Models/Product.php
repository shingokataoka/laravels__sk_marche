<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'name',
        'information',
        'price',
        'sort_order',
        'secondary_category_id',
        'image1',
        'image2',
        'image3',
        'image4',
        'is_selling',
    ];

    // 画像ありを1に詰めた状態でimage1〜4を取得する。
    // 追加と更新で使う。
    protected static function getImage(int $key)
    {
        // 画像ありをimage1側に詰めて、末尾側をnullにする。
        $images = [];
        if ( !empty(request()->image1) ) $images[] = request()->image1;
        if ( !empty(request()->image2) ) $images[] = request()->image2;
        if ( !empty(request()->image3) ) $images[] = request()->image3;
        if ( !empty(request()->image4) ) $images[] = request()->image4;
        // 要素が4個以上になるまでnullで埋める（多くても使わないから問題ない）。
        for ($i=0; $i<=3; $i++) { $images[] = null; }
        // $key=1 なら image1を返す。$key4 なら image4を返す。
        return $images[$key - 1];
    }


    // 追加処理。
    public static function insertRow()
    {
        $shopId = auth()->user()->shop->id;

        // sort_orderの連番で保存の方法。

        // まず、新規登録のsort_order以上の全レコードを+1する。
        // （新規登録のsort_order番号を開けるため。）
        $shopId = auth()->user()->shop->id;
        Product::where('shop_id', $shopId)
            ->where('sort_order', '>=', request()->sort_order)
            ->update(['sort_order' => DB::raw('sort_order +1')]);

        // すると空くので、そのsort_orderのままレコード挿入ができる。
        $product = Product::create([
            'shop_id' => $shopId,
            'name' => request()->name,
            'information' => request()->information,
            'price' => request()->price,
            'sort_order' => request()->sort_order,
            'secondary_category_id' => request()->secondary_category_id,
            'image1' => self::getImage(1),
            'image2' => self::getImage(2),
            'image3' => self::getImage(3),
            'image4' => self::getImage(4),
            'is_selling' => request()->is_selling,
        ]);

        // 全体のsort_orderの連番を振り直す。
        // （全体のsort_orderが飛び飛びや重複を防ぐため。）
        DB::unprepared("
            set @cnt_i:=0;
            update products set sort_order = (@cnt_i := @cnt_i + 1 )
            WHERE shop_id={$shopId}
            ORDER BY sort_order;
        ");

        return $product;
    }


    public function stocks()
    {
        return $this->hasMany(Stock::class, 'product_id');
    }



    public function image_1()
    {
        return $this->belongsTo(Image::class, 'image1');
    }

    public function image_2()
    {
        return $this->belongsTo(Image::class, 'image2');
    }

    public function image_3()
    {
        return $this->belongsTo(Image::class, 'image3');
    }

    public function image_4()
    {
        return $this->belongsTo(Image::class, 'image4');
    }

}
