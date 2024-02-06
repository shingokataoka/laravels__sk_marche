<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Product;
use App\Services\ImageService;
use App\Models\PrimaryCategory;
use App\Models\Image;

class ExpiredProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // 特定のproductが何ページ目かを返す。
    public function getProductPage($productId)
    {
        $shopId = auth()->user()->shop->id;
        $product = Product::findOrFail($productId);
        $count = Product::
            where('shop_id', $shopId)
            ->where('sort_order', '<=', $product->sort_order)->count();
        $current_page = ceil( $count / 15 );
        return $current_page;
    }



    // index商品一覧
    public function index()
    {
        $shopId = auth()->user()->shop->id;
        $products = Product::with('image_1', 'secondary_category')
            ->where('shop_id', $shopId)
            ->searchProducts()
            ->onlyTrashed()->paginate(15);

        $primaryCategories = PrimaryCategory::orderBy('sort_order')
            ->with(['secondary_categories' => function($q){
                $q->orderBy('sort_order');
            }])->get();

        $productDirUrl = ImageService::getProductImageUrl('');

        $initialCategoryId = (string)request()->query('categoryId');
        $initialKeyword = (string)request()->query('keyword');
        $initialSortType = request()->query('sortType');
        if( empty($initialSortType) ) $initialSortType = \Constant::ORDER_RECOMMEND;

        return Inertia::render('Owner/ExpiredProducts/Index', compact('products', 'productDirUrl', 'primaryCategories', 'initialCategoryId', 'initialKeyword', 'initialSortType'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    // show詳細ページ(「商品一覧に戻す」。)
    public function show(string $id)
    {
        $product = Product::onlyTrashed()->with(['image_1', 'image_2', 'image_3', 'image_4'])
            ->findOrFail($id);
        $productImageUrls = [
            $product->image1_url,
            $product->image2_url,
            $product->image3_url,
            $product->image4_url,
        ];


        $current_quantity = $product->stocks->sum('quantity');

        $imageDirUrl = ImageService::getProductImageUrl('');

        $ownerId = auth()->id();
        $firstPageImages = Image::where('owner_id', $ownerId)->orderByDesc('id')->paginate(15);

        // カテゴリ２を所持したカテゴリ1を取得。
        $primaryCategories = PrimaryCategory::orderBy('sort_order')
            ->with(['secondary_categories' => function($q){
                $q->orderBy('sort_order');
            }])
            ->get();

        return Inertia::render('Owner/ExpiredProducts/Show', compact('product', 'current_quantity', 'imageDirUrl', 'firstPageImages', 'primaryCategories', 'productImageUrls'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // update「商品一覧に戻す」処理。
    public function update(Request $request, string $id)
    {

        // ゴミ箱から出す。
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();
        // フラッシュをセット。
        session()->flash('status', 'success');
        session()->flash('message', __("Product \":name\" has been restored.", ['name' => $product->name]));

        // 復元後、どこのページか取得。
        $current_page = $this->getProductPage($id);
        // 「商品管理」一覧にリダイレクト移動。
        return to_route('owner.products.index', ['page' => $current_page]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
