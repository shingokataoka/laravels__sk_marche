<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Shop;
use App\Models\PrimaryCategory;
use App\Models\Image;
use App\Models\Stock;
use App\Http\Requests\Owner\ProductStoreRequest;
use App\Http\Requests\Owner\ProductUpdateRequest;

use Inertia\Inertia;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    // {product}がある時に、ownerのshopのproductでないなら404にする。
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // {product}があるなら処理
            $productId = $request->route()->originalParameters()['product'];
            if ( !empty($productId) ) {
            $product = Product::findOrFail($productId);
            // ptoductがownerのshopの子でないなら404にする
             $owner = auth()->user();
             if ($owner->shop->id !== $product->shop_id) abort(404);
            }
            return $next($request);
        })->only(['edit', 'destroy']);
    }

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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shopId = auth()->user()->shop->id;
        $products = Product::with('image_1', 'secondary_category')
            ->where('shop_id', $shopId)
            ->searchProducts()
            ->paginate(15);
        // dd( $products->pluck('sort_order') );
        // dd( $products->pluck('price') );
        // dd( $products->pluck('created_at') );

        $primaryCategories = PrimaryCategory::orderBy('sort_order')
            ->with(['secondary_categories' => function($q){
                $q->orderBy('sort_order');
            }])->get();

        $productDirUrl = ImageService::getProductImageUrl('');

        $initialCategoryId = (string)request()->query('categoryId');
        $initialKeyword = (string)request()->query('keyword');
        $initialSortType = request()->query('sortType');
        if( empty($initialSortType) ) $initialSortType = \Constant::ORDER_RECOMMEND;

        return Inertia::render('Owner/Products/Index', compact('products', 'productDirUrl', 'primaryCategories', 'initialCategoryId', 'initialKeyword', 'initialSortType'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $imageDirUrl = ImageService::getProductImageUrl('');

        $ownerId = auth()->id();
        $firstPageImages = Image::where('owner_id', $ownerId)->orderByDesc('id')->paginate(15);

        // カテゴリ２を所持したカテゴリ1を取得。
        $primaryCategories = PrimaryCategory::orderBy('sort_order')
            ->with(['secondary_categories' => function($q){
                $q->orderBy('sort_order');
            }])
            ->get();

        return Inertia::render('Owner/Products/Create', compact('imageDirUrl', 'firstPageImages', 'primaryCategories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductStoreRequest $request)
    {
        // Productの新規登録
        // Stockの新規登録
        // だからTransactionで保存。失敗時はどちらもrollbackでなかったことにする。
        DB::beginTransaction();
        try {
            $product = Product::insertRow();
            Stock::create([
                'product_id' => $product->id,
                'type' => \Constant::PRODUCT_ADD,
                'quantity' => request()->post('quantity'),
            ]);
            DB::commit();
            session()->flash('status', 'success');
            session()->flash('message', __('Added an product.'));
        } catch (\Exception $e) {
            DB::rollback();
            session()->flash('status', 'error');
            session()->flash('message', __('An error has occurred. Please try again.'));
        }

        return to_route('owner.products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        dd(__FUNCTION__);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with(['image_1', 'image_2', 'image_3', 'image_4'])
            ->find($id);
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

        return Inertia::render('Owner/Products/Edit', compact('product', 'current_quantity', 'imageDirUrl', 'firstPageImages', 'primaryCategories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $product = Product::updateRow();
            // 数量が0越えならStockに追加。
            if ( request()->quantity > 0 ) {
                Stock::create([
                    'product_id' => $product->id,
                    'type' => request()->post('type'),
                    'quantity' => request()->post('quantity'),
                ]);
            }
            session()->flash('status', 'success');
            session()->flash('message', __('Product data has been updated.'));
            DB::commit();
        } catch(\Exception $e) {
            DB::rollBack();
            dd($e->getMessage(), $e->getLine() );
            session()->flash('status', 'error');
            session()->flash('message', __('An error has occurred. Please try again.'));
        }
        $current_page = $this->getProductPage($product->id);
        return to_route('owner.products.index', ['page' => $current_page]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(product $product)
    {
        $current_page = $this->getProductPage($product->id);
        $name = $product->name;
        // ソフトデリート
        $product->delete();
        session()->flash('status', 'error');
        session()->flash('message', __("Product \":name\" has been deleted.", ['name' => $name]) );

        return to_route('owner.products.index', ['page' => $current_page]);
    }
}
