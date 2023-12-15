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
            $productId = $request->route('product');
            if ( !empty($productId) ) {
            $product = Product::findOrFail($productId);
            // ptoductがownerのshopの子でないなら404にする
             $owner = auth()->user();
             if ($owner->shop->id !== $product->shop_id) abort(404);
            }
            return $next($request);
        })->only(['edit']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shopId = auth()->user()->shop->id;
        $products = Product::with('image_1')->where('shop_id', $shopId)->orderBy('sort_order')->paginate(15);

        $productDirUrl = ImageService::getProductImageUrl('');

        return Inertia::render('Owner/Products/Index', compact('products', 'productDirUrl'));
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
                'type' => 0,
                'quantity' => request()->post('quantity'),
            ]);
            DB::commit();
            session()->flash('status', 'success');
            session()->flash('message', '登録成功');
        } catch (\Exception $e) {
            DB::rollback();
            session()->flash('status', 'error');
            session()->flash('message', '失敗');
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        dd(__FUNCTION__);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        dd(__FUNCTION__);
    }
}
