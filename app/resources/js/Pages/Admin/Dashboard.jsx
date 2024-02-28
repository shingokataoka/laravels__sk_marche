import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { css } from '@emotion/react';

import nl2br from '@/Functions/nl2br';


/** @jsxImportSource @emotion/react */
export default function Dashboard({ auth }) {
    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Admin") + __("Dashboard") }</h2>}
        >
            <Head title={ __("Admin") + __("Dashboard") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <div css={css`text-align:center;`}>{nl2br(`
                                admin系（サイト自体を管理するユーザー）ページの機能は以下になります。

                                「オーナー管理」
                                オーナー（owner系ユーザー）の追加や削除（期限切れオーナーに入れる）ができます。
                                オーナーは、当サイト内でEC店舗を開く事ができるユーザーです。

                                「期限切れオーナー一覧」
                                オーナーの復元と削除（完全削除）ができます。
                            `)}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
