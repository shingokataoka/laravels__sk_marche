import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { css } from '@emotion/react';
import nl2br from '@/Functions/nl2br';

/** @jsxImportSource @emotion/react */
export default function Dashboard({ auth }) {
    return (
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") + __("Dashboard") }</h2>}
        >
            <Head title={ __("Owner") + __("Dashboard") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <div css={css`text-align:center;`}>{nl2br(`
                                owner系（EC店舗を持ち管理できるユーザー）ページの機能は以下になります。

                                「店舗情報」
                                EC店舗のイメージ画像や店舗名、店舗説明文などを編集できます。

                                「画像管理」
                                EC店舗内で扱う商品の画像を登録、編集、削除ができます。

                                「商品管理」
                                EC店舗内で扱う商品を登録、編集、削除（削除した商品一覧に入れる）ができます。

                                「削除した商品一覧」
                                削除した商品を復元するかを選べます。
                            `)}
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}
