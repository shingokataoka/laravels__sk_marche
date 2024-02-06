<?php
namespace App\Constants;

class Common
{
    // 商品の在庫の増減のタイプを示す定数。
    // 追加、売れて減る、stripeでキャンセルなら増やす。
    const PRODUCT_ADD = '1';
    const PRODUCT_REDUCE = '2';
    const PRODUCT_CANCEL = '3';
    // 上記を配列でも宣言。
    const PRODUCT_LIST = [
        'add' => self::PRODUCT_ADD,
        'reduce' => self::PRODUCT_REDUCE,
        'cancel' => self::PRODUCT_CANCEL,
    ];

    // 商品一覧の表示順を選択を示す定数。
    const ORDER_RECOMMEND = 1;
    const ORDER_HIGHER_PRICE = 2;
    const ORDER_LOWER_PRICE = 3;
    const ORDER_LATER = 4;
    const ORDER_OLDER = 5;
    const DELETED_ORDER_LATER = 6;
    const DELETED_ORDER_OLDER = 7;
    // 上記を配列でも宣言。
    const SORT_ORDER = [
        'recommend' => self::ORDER_RECOMMEND,
        'higher_price' => self::ORDER_HIGHER_PRICE,
        'lower_price' => self::ORDER_LOWER_PRICE,
        'later' => self::ORDER_LATER,
        'older' => self::ORDER_OLDER,
        'deleted_later' => self::DELETED_ORDER_LATER,
        'deleted_older' => self::DELETED_ORDER_OLDER,
    ];
}
