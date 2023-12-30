<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use App\Services\ImageService;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();
        $user = User::with('products.image_1')->findOrfail($userId);

        $productImageDirUrl = ImageService::getProductImageUrl('');
        $noImageUrl = ImageService::getNoImageUrl();

        return Inertia::render('User/Carts/Index', compact('user', 'productImageDirUrl', 'noImageUrl') );
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
        // 指定した数量がゼ0なら404で処理しない。
        if ( (int)$request->post('quantity') <= 0 ) abort(404);
        // ログインuserのカートに商品idと購入数を入れる。
        $user = auth()->user();
        $productId = $request->post('product_id');
        $addQuantity = (int)$request->post('quantity');

        // 追加前の同商品のカート内数量を取得する。
        $oldQuantity = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)->sum('quantity');

        // user,productなcartレコードに、追加した数量で上書き更新する。
        $user->products()->syncWithoutDetaching([
            $productId => ['quantity' => $oldQuantity + $addQuantity]
        ]);

        return to_route('user.cart.index');

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
        $user = auth()->user();
        $productId = request()->post('product_id');
        // userとproductIdペアの中間レコードを消す。
        $user->products()->detach([$productId]);

        return to_route('user.cart.index');
    }
}
