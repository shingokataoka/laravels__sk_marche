<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;

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
        });
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owner = auth()->user();
        dd($owner);
        dd(__FUNCTION__);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd(__FUNCTION__);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd(__FUNCTION__);
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
        dd(__FUNCTION__);
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
