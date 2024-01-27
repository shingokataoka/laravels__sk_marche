import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { css, useMediaQuery } from '@mui/material';

import ImageService from '@/Services/ImageService';

import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {Link} from '@inertiajs/react';
import {Pagination} from '@mui/material';

import dayjs from "dayjs";
// プラグインが必要
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// tzを有効にする記述
dayjs.extend(utc);
dayjs.extend(timezone);


/** @jsxImportSource @emotion/react */
export default function Index({ auth, user, orders }) {
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints
    const isMobile = useMediaQuery(`(max-width:${(bp.values.tablet - 0.001)}px)`);

    const [processing, setProcessing] = useState(false)

    // ページネーションを押した時の処理
    const pageChange = (e, currentpage) => {
        setProcessing(true)
        router.visit( route('user.orders.index', {page:currentpage}), {
            method:'get',
        } )
    }


    const allProps = { palette, bp, isMobile, orders }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __('Purchase history') }</h2>}
        >
            <Head title={ __('Purchase history') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="text-gray-900 dark:text-gray-100">

                            <h1 css={css`
                                text-align:center;
                                font-size:1.2rem;
                                padding-top:16px;
                                padding-bottom:32px;
                            `}>{ __('Purchase history list') }</h1>

                            {/* スマホ用表示のJSX */}
                            <div css={css` ${bp.up('tablet')}{ display:none; } `}>
                                <MobileJsx allProps={allProps} />
                            </div>

                            {/* タブレット幅以上用の表示のJSX */}
                            <div css={css` ${bp.down('tablet')}{ display:none; } `}>
                                <TabletJsx allProps={allProps} />
                            </div>

                            {/* ページネーション */}
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                css={css`margin:32px 0;`}
                            >
                                <Pagination
                                    count={ orders.last_page }
                                    page={ orders.current_page }
                                    disabled={processing}
                                    onChange={pageChange}
                                />
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



{/* スマホ用表示のJSX */}
function MobileJsx({ allProps }) {
    const { palette, orders } = allProps

    return (<Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        css={css` padding:0 2px; `}
    >
        {/* オーダーでループ */}
        { orders.data.map((order, index) => {

            return (<Stack
                key={index}
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                css={css`
                    border:1px ${palette.bg5} solid;
                    padding: 8px 0;
                    text-align:center;
                `}
            >
                {/* 購入日 */}
                <div>{ __('Purchase date') }：{ dayjs(order.created_at).tz().format('YYYY/MM/DD') }</div>
                {/* 注文番号 */}
                <div css={css`
                    border-bottom:1px ${palette.bg3} solid;
                `}>{ __('Order ID') }：{ order.id }</div>

                {/* 商品一覧 */}
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    {/* Order内の商品でループ */}
                    { order.ordered_products.map((ordered_product, index2) => {
                        const product = ordered_product.product

                        return (<div key={index2} css={css`width:100%;`}>
                            <Stack
                                key={index2}
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={0}
                            >
                                {/* 商品画像。なければno_image */}
                                <ImageJsx allProps={allProps} product={product} />
                                {/* 商品名 */}
                                <div>{ product.name }</div>
                                {/* 単価 */}
                                <div>
                                    <span css={css`font-size:0.8rem;`}> { __('Unit price') } </span>
                                    { product.price.toLocaleString() }
                                    <span css={css`font-size:0.8rem;`}> { __('JPY (tax included)') }</span>
                                </div>
                                {/* 個数 */}
                                <div>
                                    { ordered_product.quantity }
                                    <span css={css`font-size:0.8rem;`}> { __('') }</span>
                                </div>

                                <hr css={css`
                                    border-top:1px ${palette.bg3} solid;
                                    width:calc(100% - 16px);
                                `} />
                            </Stack>
                        </div>)
                    }) }

                    {/* 合計 */}
                    <TotalPriceJsx allProps={allProps} order={order} />
                </Stack>



            </Stack>)
        }) }
    </Stack>)
}





{/* タブレット幅以上用の表示のJSX */}
function TabletJsx({ allProps }) {
    const { palette, orders, } = allProps

    // 購入日 | 商品一覧 | 合計
    return (<Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-start"
    spacing={2}
    css={css`
            max-width: 800px;
            margin:0 auto;

    `}
    >
        {/* Orderごとにループ */}
        { orders.data.map((order, index) => (<Stack
            key={index}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={3}
            css={css`
                border:1px ${palette.bg5} solid;
                padding:8px;
                width:100%;
            `}
        >
            <div>
                {/* 購入日 */}
                <div>{ __('Purchase date') }：{ dayjs(order.created_at).tz().format('YYYY/MM/DD') }</div>
                {/* 注文番号 */}
                <div>{ __('Order ID') }：{ order.id }</div>
            </div>
            {/* 商品一覧 */}
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={0}
                css={css`
                    padding:0 16px;
                    border-left:1px ${palette.bg4} solid;
                    border-right:1px ${palette.bg4} solid;
                `}
            >
                {/* Order内の商品でループ */}
                { order.ordered_products.map((ordered_product, index2) => {
                    const product = ordered_product.product

                    return (<div key={index2} css={css`width:100%;`}>
                        { (index2 === 0)? '' :
                        <hr css={css`
                            margin:8px 0;
                            border-top:1px ${palette.bg3} solid;
                            width:100%;
                        `} />
                        }
                        <Stack
                            key={index2}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                        >
                            {/* 商品画像。なければno_image */}
                            <ImageJsx allProps={allProps} product={product} />
                            {/* 商品名 */}
                            <div>{ product.name }</div>
                            {/* 単価 */}
                            <div>
                                <span css={css`font-size:0.8rem;`}> { __('Unit price') } </span>
                                { product.price.toLocaleString() }
                                <span css={css`font-size:0.8rem;`}> { __('JPY (tax included)') }</span>
                            </div>
                            {/* 個数 */}
                            <div>
                                { ordered_product.quantity }
                                <span css={css`font-size:0.8rem;`}> { __('') }</span>
                            </div>
                        </Stack>
                    </div>)
                }) }
            </Stack>

            {/* 合計 */}
            <TotalPriceJsx allProps={allProps} order={order} />
        </Stack>)
        ) }
    </Stack>)
}




// 商品画像のJSX
function ImageJsx({ allProps, product }) {
    const { palette, } = allProps

    // imgタグのJSXを定数にしておく。
    const imgJsx = <img src={ ImageService.getProductImageUrl(product.image_1) }
            css={css`
                outline:1px ${palette.bg3} solid;
                width:80px;
                min-width:80px;
                object-fit:contain;
                aspect-ratio:5/3;
            `}
        />

    // ショップ「システム」の商品ならリンクなし画像を返す。
    if ( product.shop.id === 1 ) return (<>
        {imgJsx}
    </>)

    return (<Link href={ route('user.products.show',{product: product.id}) }>
        {imgJsx}
    </Link>)

}




// 合計金額のJSX
function TotalPriceJsx({ allProps, order }) {
    // このオーダーの合計を算出
    let totalPrice = 0
    order.ordered_products.map(row => {
        totalPrice += row.product.price * row.quantity
    })

    return (<div>
        <div css={css`display:inline-block; padding-right:4px;`}>合計</div>
        <div css={css`display:inline-block;`}>
            { totalPrice.toLocaleString() }
            <span css={css` font-size:0.8rem; `}> { __('JPY (tax included)') }</span>
        </div>
    </div>)
}
