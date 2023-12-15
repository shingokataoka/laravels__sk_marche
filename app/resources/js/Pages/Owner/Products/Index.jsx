import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { DefaultThemeProvider } from '@/Components/DefaultThemeProvider';
import { css } from '@emotion/react';

import { router } from '@inertiajs/react';

import {Link} from '@inertiajs/react';
import { Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import {Button} from '@mui/material';

import dayjs from "dayjs";
// プラグインが必要
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState } from 'react';
// tzを有効にする記述
dayjs.extend(utc);
dayjs.extend(timezone);
// ブラウザのtimezoneを予測で取得する（つまり'Asia/Tokyo'などを取得する）。
const defaultTimezone = dayjs.tz.guess()
// dayjsのデフォルトのtimezoneを設定の例。
// 未指定なら、ブラウザのtimezone（つまりJST）が使用される。
dayjs.tz.setDefault(defaultTimezone);


/** @jsxImportSource @emotion/react */
export default function Index({ auth, products, productDirUrl }) {
    const palette = defaultTheme().palette

    const [disabled, setDisabled] = useState(false)
    const [nowPage, setNowPage] = useState(products.current_page)

    const PaginationChange = (e, page) => {
        setNowPage(page)
        router.visit( route('owner.products.index'), {
            method: 'get',
            data: { page:page },
        })
    }


    return (<DefaultThemeProvider>
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Manage Products") }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Manage Products") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 max-w-[790px] mx-auto">


                            <Stack
                            direction="row"
                            justifyContent="flex-end"
                            >
                                <Button variant="contained" component={Link}
                                    href={ route('owner.products.create') }
                                >{ __('add new') }</Button>
                            </Stack>

                            <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            useFlexGap={true}
                            flexWrap="wrap"
                            spacing={2}
                            css={css` margin-top: 32px;`}
                            >
                                {products.data.map( product => (
                                    <ImageCard key={product.id} product={product} productDirUrl={productDirUrl} />
                                ) )}
                            </Stack>

                            <Stack spacing={2} direction="row" justifyContent="flex-end" className="mt-[16px]">
                                <Pagination count={products.last_page} defaultPage={products.current_page} siblingCount={2} boundaryCount={2}
                                    disabled={disabled}
                                    onChange={PaginationChange}
                                />
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    </DefaultThemeProvider>);
}

function ImageCard ({product, productDirUrl}) {
    const palette = defaultTheme().palette

    const url =(!product.image_1)? '/images/no_image.png' : productDirUrl + product.image_1.filename

    return (<Link
        href={ route('owner.products.edit', {product: product.id}) }
        css={css`
            margin-top: 8px;
            border: 1px ${palette.bg4} solid;
            border-radius: 8px;
            width: 135px;
            min-width: 135px;
            overflow: hidden;
            font-size: 0.9rem;
        `}
    >
        <Stack alignItems="center" >
            <img
                src={ url }
                css={css`
                    max-width: 135px;
                    max-height: 135px;
                `}
            />
        </Stack>
        <div css={css` padding:8px; `}>
            <div>{ product.name }</div>
            <div>{ dayjs(product.created_at).tz().format('YYYY-MM-DD') }</div>
        </div>
    </Link>);

}

