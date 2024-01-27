<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Laravel\Cashier\Exceptions\IncompletePayment;

use App\Services\ImageService;
use App\Services\SystemService;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderedProduct;
use App\Models\Product;

class PurchaseController extends Controller
{
    // カート内商品の支払いページを表示する。
    public function index()
    {
        $userId = auth()->id();
        $user = User::with('products.image_1')->findOrfail($userId);

        // カート内が空ならカートページに戻す。
        if ( $user->products->count() === 0 ) return to_route('user.cart.index');

        // 合計金額を取得。
        $totalPrice = 0;
        foreach ($user->products as $product) {
            $totalPrice += $product->price * $product->pivot->quantity;
        }
        // サブスクでないなら、送料も追加する処理。
        // サブスク契約済（現在無料トライアル期間内も含む）ならtrueを返す
        $postage = null;
        if (!$user->subscribed('default')) {
            // 商品「送料」を取得。
            $postage = SystemService::getPostage();
            // 合計に送料を足す。
            $totalPrice += $postage->price;
        }

        return view('user.stripe.purchase', compact('user', 'totalPrice', 'postage'));
    }


    // カート内商品の支払いの処理をする。
    public function create()
    {
        // まず合計金額を取得。
        $userId = auth()->id();
        $user = User::with('products.image_1')->findOrfail($userId);
        // [商品ID、価格、数量]な配列を作成。
        $products = [];
        foreach ($user->products as $product) {
            $products[] = [
                'id' => $product->id,
                'price' => $product->price,
                'quantity' => $product->pivot->quantity,
            ];
        }
        // サブスクでないなら、$productsに「送料」も加える。
        // サブスク契約済（現在無料トライアル期間内も含む）ならtrueを返す
        if (!$user->subscribed('default')) {
            $postage = SystemService::getPostage();
            $products[] = [
                'id' => $postage->id,
                'price' => $postage->price,
                'quantity' => 1,
            ];
        }

        // 合計を算出。
        $amount = 0;
        foreach ($products as $product) {
            $amount += $product['price'] * $product['quantity'];
        }

        // 支払い処理をしていく。
        // DB::beginTransaction();
        try {
            // cashier Stripeで一回支払い決済を実行。
            $paymentMethodId = request()->post('paymentMethodId');
            $payment = auth()->user()->charge(
                $amount,
                $paymentMethodId,
                [
                    'return_url' => route('user.cart.index'),
                ],
            );
            // ordersテーブルに購入履歴を追加。
            $order = Order::create([
                'user_id' => $user->id,
                'payment_id' => $payment->id,
            ]);

            // orderd_productsテーブルに購入履歴の商品データを追加する。
            $insertRows = [];
            foreach ($products as $product) {
                $insertRows[] = [
                    'order_id' => $order->id,
                    'product_id' => $product['id'],
                    'price' => $product['price'],
                    'quantity' => $product['quantity'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
            OrderedProduct::insert($insertRows);

            // ユーザーのカートを空にする。
            $user->products()->detach();

            // DB::commit();
            // 支払い成功後の処理。
            session()->flash('status', 'success');
            session()->flash('message', __('Payment completion.') );
        } catch (IncompletePayment $exception) {
            // DB::rollBack();
            // cashier stripe支払い失敗時の処理。
            session()->flash('status', 'error');
            session()->flash('message', __('Payment processing failed.\r\nPlease try again.') );
        }

        return to_route('user.cart.index');
    }

}
