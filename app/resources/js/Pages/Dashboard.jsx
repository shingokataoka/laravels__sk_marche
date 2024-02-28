import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { css } from '@emotion/react';
import nl2br from '@/Functions/nl2br';

/** @jsxImportSource @emotion/react */
export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("User") + __("Dashboard") }</h2>}
        >
            <Head title={ __("User") + __("Dashboard") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <div css={css`text-align:center;`}>{nl2br(`
                                user系（商品を購入するユーザー）ページの機能は以下になります。

                                「商品一覧」
                                販売中の商品一覧が見れるページです。
                                カテゴリやキーワードでの絞り込み検索や、表示順を選択することができます。
                                商品を選び、購入数を指定してカートに入れることができます。

                                「カート」
                                カートに入れた各商品の価格や数量などが見れます。
                                購入を選択すると、laravel cashierによるstripe決済で構築した会計ページに移動します。
                                この決済はテスト動作によるものです。

                                「購入履歴」
                                購入した商品の購入数や支払い金額などが見れます。

                                「契約情報」
                                userの会員ランクや登録日、解約日などが見れます。
                                会員ランクは、最初は"一般会員"で登録すると"プレミアム会員"になります。

                                プレミアム会員になると商品購入時の送料が無料になります。
                                登録するをクリックすると、laravel cashierによるstripeのサブスク契約で構築した決済ページに移動します。
                                この決済はテスト動作によるものです。
                            `)}</div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
