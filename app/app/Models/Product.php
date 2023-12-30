<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;






class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

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
        $information =( empty(request()->information) )? '' : request()->information;
        $product = Product::create([
            'shop_id' => $shopId,
            'name' => request()->name,
            'information' => $information,
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
            WHERE shop_id={$shopId} AND deleted_at IS NULL
            ORDER BY sort_order;
        ");

        // ソフトデリート済の商品は、sort_order=0にする。
        $trashedProducts = Product::onlyTrashed()->where('shop_id', $shopId)->update(['sort_order' => 0]);


        return $product;
    }
    // 更新処理。
    public static function updateRow()
    {
        $shopId = auth()->user()->shop->id;

        $productId = request()->route()->originalParameters()['product'];
        $product = Product::findOrFail($productId);

        // sort_orderの連番で更新・保存の方法。

        // まず、更新のsort_orderを入れる隙間を空ける。
        $shopId = auth()->user()->shop->id;
        $newSortOrder = request()->post('sort_order');
        // もとより大きくなる場合、目的まで-1して入れれば、詰めると合う。
        if ( $product->sort_order < $newSortOrder ) {
            Product::where('shop_id', $shopId)
                ->where('sort_order', '<=', $newSortOrder )
                ->update(['sort_order' => DB::raw('sort_order -1')]);
        // もとより小さくなる場合、目的以上を+1して入れれば、詰めると合う。
        } elseif ( $product->sort_order > $newSortOrder ) {
            Product::where('shop_id', $shopId)
                ->where('sort_order', '>=', $newSortOrder )
                ->update(['sort_order' => DB::raw('sort_order +1')]);
        }

        // すると空くので、そのsort_orderのままレコード更新ができる。
        $information =( empty(request()->information) )? '' : request()->information;
        $product->name = request()->post('name');
        $product->information = $information;
        $product->price = request()->post('price');
        $product->sort_order = request()->post('sort_order');
        $product->secondary_category_id = request()->post('secondary_category_id');
        $product->image1 = self::getImage(1);
        $product->image2 = self::getImage(2);
        $product->image3 = self::getImage(3);
        $product->image4 = self::getImage(4);
        $product->is_selling = request()->post('is_selling');
        $product->save();

        // 全体のsort_orderの連番を振り直す。
        // （全体のsort_orderが飛び飛びや重複を防ぐため。）
        DB::unprepared("
            set @cnt_i:=0;
            update products set sort_order = (@cnt_i := @cnt_i + 1 )
            WHERE shop_id={$shopId} AND deleted_at IS NULL
            ORDER BY sort_order;
        ");

        // ソフトデリート済の商品は、sort_order=0にする。
        $trashedProducts = Product::onlyTrashed()->where('shop_id', $shopId)->update(['sort_order' => 0]);

        return $product;
    }


    // ローカルスコープ。検索結果で返すproductsとソートを変える。
    public function scopeSearchProducts($query)
    {
        $categoryId = (int)request()->query('categoryId');
        $keyword = request()->query('keyword');
        $sortType = (int)request()->query('sortType');

        // 選択カテゴリがあるなら絞り込む。
        if ( $categoryId >= 1) { $query->where('secondary_category_id', $categoryId); }
        // 検索キーワードがあるなら部分一致で絞り込む。
        if ( !empty($keyword) ) {
            $query->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                ->orWhere('information', 'like', "%{$keyword}%");
            });
        }

        // 価格が高い順の場合のソートをする。
        if ( $sortType === \Constant::ORDER_HIGHER_PRICE ) {
            $query->orderByDesc('price');
        // 価格が安い順の場合のソートをする。
        } else if ( $sortType === \Constant::ORDER_LOWER_PRICE ) {
            $query->orderBy('price');
        // 新しい順の場合のソートをする。
        } else if ( $sortType === \Constant::ORDER_LATER ) {
            $query->orderByDesc('created_at');
        // 古い順の場合のソートをする。
        } else if ( $sortType === \Constant::ORDER_OLDER ) {
            $query->orderBy('created_at');
        // 上記以外なら、おすすめ順の場合のソートをする。
        } else {
            $query->orderBy('sort_order');
        }
        return $query;
    }




    public function users()
    {
        return $this->belongsToMany(User::class, 'carts')
        ->withPivot('id', 'quantity');
    }



    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }



    public function stocks()
    {
        return $this->hasMany(Stock::class, 'product_id');
    }


    public function secondary_category()
    {
        return $this->belongsTo(SecondaryCategory::class);
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
