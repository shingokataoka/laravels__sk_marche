<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

        // サブスク契約中ならtrueを返す。解約送信済後の残り期間もtrueを返す。
        public static function getIsPremium()
        {
            $user = auth()->user();
            return ( $user->subscribed('default') )? true : false;
        }

        // 契約日を返す。過去に一度も契約がないならnullを返す。
        public static function getAddDate()
        {
            $user = auth()->user();
            // 過去に契約がないならnullを返す。
            if ( null === auth()->user()->subscription('default') ) return null;
            // 契約日を返す。
            return self::where('user_id',$user->id)->first()->created_at;
        }

        // (元)契約者がサブスク解約を送信した日を返す。以外はnullを返す。
        public static function getCancelDate()
        {
            $user = auth()->user();
            // 過去に契約がないならnullを返す。
            if ( null === $user->subscription('default') ) return null;
            // サブスクを解約済でないならnullを返す。
            if ( !$user->subscription('default')->canceled() ) return null;
            // 解約を送信した日を返す。
            return self::where('user_id',$user->id)->first()->updated_at;
        }

        // (元)契約者の解約日（つまりサブスク残り最終日）を返す。以外はnullを返す。
        public static function getLastDate()
        {
            $user = auth()->user();
            // 過去に契約がないならnullを返す。
            if ( null === $user->subscription('default') ) return null;
            // 解約日（最終日）を返す。
            return self::where('user_id', $user->id)->first()->ends_at;
        }

}
