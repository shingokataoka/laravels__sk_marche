<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\PrimaryCategory;
use App\Services\ImageService;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['image_1', 'secondary_category'])->searchProducts()
            ->where('is_selling', 1)
            ->paginate(15);

        $primaryCategories = PrimaryCategory::orderBy('sort_order')
            ->with(['secondary_categories' => function($q){
                $q->orderBy('sort_order');
            }])->get();

        $productDirUrl = ImageService::getProductImageUrl('');

        $initialCategoryId = (string)request()->query('categoryId');
        $initialKeyword = (string)request()->query('keyword');
        $initialSortType = request()->query('sortType');
        if( empty($initialSortType) ) $initialSortType = \Constant::ORDER_RECOMMEND;

        return Inertia::render('User/Products/Index', compact('products', 'productDirUrl', 'primaryCategories', 'initialCategoryId', 'initialKeyword', 'initialSortType'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd( __FUNCTION__ );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd( __FUNCTION__ );
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = auth()->user();
        $product = Product::with(['image_1', 'secondary_category', 'stocks', 'shop'])->findOrFail($id);

        // もしショップ「システム」の商品データなら、404 not found にする。
        if ($product->shop->id === 1) abort(404);

        // 最大で購入できる個数を取得。
        $productQuantity = $product->stocks->sum('quantity');
        // すでにカートに入れた数量を引いた最大購入可能な個数にする。
        $cartQuantity = $user->products->find($id)->pivot->quantity;
        $productQuantity -= $cartQuantity;

        if ($productQuantity > 99 ) { $maxQuantity = 99; }
        else if ($productQuantity < 0) { $maxQuantity = 0; }
        else { $maxQuantity = $productQuantity; }


        $imageUrls = ImageService::getProductImageUrls($product);

        $shop = $product->shop;
        $shopImageUrl = ImageService::getShopImageUrl($shop->filename);

        return Inertia::render('User/Products/Show', compact('product', 'maxQuantity', 'imageUrls', 'shop', 'shopImageUrl'));
        dd( __FUNCTION__ );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        dd( __FUNCTION__ );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd( __FUNCTION__ );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        dd( __FUNCTION__ );
    }
}
