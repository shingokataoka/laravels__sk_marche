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
use App\Models\Stock;

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
        // ---まず合計金額を取得。---
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


        // ---数量が足りない場合の処理---
        // 数量が足りない商品があれば配列に入れる。
        $missingProducts = [];
        foreach ($user->products as $product) {
            $cartQuantity = (int)$product->pivot->quantity;
            $stockQuantity = (int)Stock::where('product_id', $product->id)->sum('quantity');
            if ($stockQuantity < $cartQuantity) {
                $missingProducts[] = $product;
            }
        }
        // 数量不足の商品のフラッシュメッセージを配列に入れる。
        $flashTexts = [];
        foreach($missingProducts as $row) {
            $flashTexts[] = __("Product \":name\" is out of stock.", ["name" => $row->name]);
        }
        // 数量不足の商品のフラッシュメッセージがある場合の処理。
        // フラッシュを\r\nで繋いで完成させセットして、カートにリダイレクト移動する。
        if ($flashTexts !== []) {
            $flashTexts[] = __("Please delete it from your cart and try again.");
            $flashText = implode("\r\n", $flashTexts);
            session()->flash('status', 'warning');
            session()->flash('message', $flashText);
            return to_route('user.cart.index');
        }


        // ---支払い処理をしていく。---

        // cashierの支払い。
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
        // 失敗したらフラッシュをセットしてcart.indexにリダイレクト移動。
        } catch (IncompletePayment $exception) {
            // 「支払い失敗」のフラッシュをセット。
            session()->flash('status', 'error');
            session()->flash('message', __("Payment processing failed.\r\nPlease try again.") );
            // 「カート」ページにリダイレクト移動。
            return to_route('user.cart.index');
        }

        // 支払い後のDB処理をしていく。
        DB::beginTransaction();
        try {
            // ordersテーブルに購入履歴を追加。
            $order = Order::create([
                'user_id' => $user->id,
                'payment_id' => $payment->id,
            ]);

            // ordered_productsテーブルに購入履歴の商品データを追加する。
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

            // t_stocksから、購入した分の在庫を引く。
            foreach ($user->products as $product) {
                Stock::create([
                    'product_id' => $product->id,
                    'type' => \Constant::PRODUCT_REDUCE,
                    'quantity' => $product->pivot->quantity,
                ]);
            }

            // ユーザーのカートを空にする。
            $user->products()->detach();

            // 支払い成功後の処理。
            DB::commit();
            session()->flash('status', 'success');
            session()->flash('message', __('Payment completion.') );
        } catch (\Exception $e) {
            // 支払い後のDB処理で失敗時の処理。
            DB::rollBack();
            // cashierで返金処理をする。
            $user->refund($payment->id);
            // 開発環境ならエラー内容を表示。
            if ( config('app.debug') ) {
                echo "支払い後のDB処理で失敗<br /><br />";
                echo $e->getMessage() . "<br /><br />";
                echo $e->getTraceAsString();
                exit;
            }
            // 「決済完了後にシステムにエラーでたから、返金した」趣旨のフラッシュをセット。
            session()->flash('status', 'error');
            session()->flash('message', __("An error occurred in the system after completing the payment. \r\nTherefore, I have processed the refund. \r\nPlease try again.") );
        }

        return to_route('user.cart.index');
    }

}
