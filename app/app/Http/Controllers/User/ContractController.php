<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Subscription;

class ContractController extends Controller
{
    public function index()
    {
        //  サブスクすぐに解約（テスト用）
        // auth()->user()->subscription('default')->cancelNow(); exit;


        // サブスク契約中ならtrueを返す。解約送信済後の残り期間もtrueを返す。
        $isPremium = Subscription::getIsPremium();
        // 契約中なら契約日を返す。未契約ならnullを返す。
        $addDate = Subscription::getAddDate();
        // (元)契約者がサブスク解約を送信した日を返す。以外はnullを返す。
        $cancelDate = Subscription::getCancelDate();
        // 元契約者のサブスク残り最終日を返す。以外はnullを返す。
        $lastDate = Subscription::getLastDate();

        return Inertia::render('User/Contracts/Index', compact('isPremium', 'addDate', 'cancelDate', 'lastDate'));
    }
}
