<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Laravel\Cashier\Exceptions\IncompletePayment;
use App\Models\Subscription;

class SubscriptionController extends Controller
{

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // すでにプレミアム会員なら「契約情報ページ」にリダイレクトする。
            if( SubScription::getIsPremium() ) {
                return to_route('user.contracts.index');
            }
            return $next($request);
        })->only(['index']);
    }

    // サブスクリプションの支払いページを表示する。
    public function index()
    {
        $intent = auth()->user()->createSetupIntent();
        return view('user.stripe.subscription', compact('intent'));
    }



    // サブスクの支払い処理をする。
    // 上記支払いページで「支払い」ボタンでのPOST送信先である。
    public function create()
    {
        // すでにプレミアム会員なら「契約情報」ページにリダイレクト移動。
        if ( Subscription::getIsPremium() ) {
            return to_route('user.constracts.index');
        }

        try {
            // cashierでStripeでサブスクの決済を実行。
            auth()->user()->newSubscription(
                'default', 'price_1OWZ8NAaxxyh99REeXyVNmGp'
            )->create( request()->post('paymentMethodId') );
            // 「支払い完了。もうプレミアム会員」なフラッシュをセット。
            session()->flash('status', 'success');
            session()->flash('message',  __("Payment has been completed.\r\n From today you are a premium member.") );

        } catch( IncompletePayment $exception ) {
            // 「支払い失敗、もう一度やり直して」なフラッシュをセット。
            session()->flash('status', 'error');
            session()->flash('message', __("I'm sorry. Payment failed.\r\n Please start over from the beginning.") );
            // 「プレミアム会員 登録」ページへリダイレクトする。
            return to_route('user.subscription.index');
        }

        // 支払い完了後、「契約情報」ページにリダイレクト移動する。
        return to_route('user.contracts.index');
    }



    // サブスクの解約処理をする（「解約する」を押した処理）。
    public function destroy()
    {
        // （プレミアム会員じゃない
        // or 解約予定日がある）
        // なら「契約情報」ページにリダイレクト移動する。
        if (
            !Subscription::getIsPremium()
            or Subscription::getLastDate()
        ) {
            return to_route('user.contracts.index');
        }

        // 解約処理をする。
        $user = auth()->user();
        try {
            $user->subscription('default')->cancel();
            // 「解約申請が完了した」趣旨のフラッシュをセット。
            $lastDate = Subscription::getLastDate();
            $lastDateStr = substr($lastDate, 0, 10);
            session()->flash('status', 'success');
            session()->flash('message', __("Your cancellation request has been completed.\r\n After :date, you will no longer be a premium member.", ['date' => $lastDateStr]));
        } catch( IncompletePayment $exception ) {
            // 「解約申請が失敗。やり直し」趣旨のフラッシュをセット。
            session()->flash('status', 'error');
            session()->flash('message', __('An error has occurred. Please try again.'));
        }

        // 「契約情報」ページにリダイレクト移動。
        return to_route('user.contracts.index');
    }
}