import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { css, useMediaQuery } from '@mui/material';

import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {Link} from '@inertiajs/react';



/** @jsxImportSource @emotion/react */
export default function Index({ auth, user, productImageDirUrl, noImageUrl }) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints
    const isMobile = useMediaQuery(`(max-width:${(bp.values.tablet - 0.001)}px)`);

    // 「カートから削除」ボタンを押したproduct_idを入れて、読み込み中を区別する。
    const [deleteProcessingId, setDeleteProcessingId] = useState(0)
    const [orderProcessing, setOrderProcessing] = useState(false)
    const [disabled, setDisabled] = useState(false)

    let totalPrice = 0
    user.products.map( (product, i) => {
        const total = product.price * product.pivot.quantity
        user.products[i].subTotal = total
        totalPrice += total
    } )


    useEffect( () => {
        if (deleteProcessingId > 0) { setDisabled(true) }
        else if (orderProcessing) { setDisabled(true) }
        else { setDisabled(false) }
    }, [deleteProcessingId, orderProcessing])


    const getImageUrl = product => {
        const filename = (!product.image_1)? null : product.image_1.filename
        if ( filename === null ) {
            return noImageUrl
        } else {
            return productImageDirUrl + product.image_1.filename
        }
    }


    const deleteSubmit = (e, product) => {
        console.log('deleteSubmit')
        if (
            !confirm(
                __("Do you want to remove item \":name\" from your cart?", {name: product.name})
            )
        ) return
        setDeleteProcessingId(product.id)
        router.visit( route('user.cart.destroy', {cart:0}), {
            method: 'delete',
            data: { _token, product_id:product.id, },
            preserveScroll: false,
            onFinish: visit => {
                setDeleteProcessingId(0)
            }
        })
    }


    const allProps = {
        user, productImageDirUrl, noImageUrl,
        _token, palette, bp, isMobile,
        deleteProcessingId, setDeleteProcessingId,
        disabled, setDisabled,
        getImageUrl, deleteSubmit
    }

    // ●合計金額
    // ●購入するボタン



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Cart") }</h2>}
        >
            <Head title={ __("Cart") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                {/* スマホ幅でカート内を表示 */}
                                <MobileProductsJsx allProps={allProps} />
                                {/* タブレット幅以上でカート内を表示 */}
                                <TabletProductsJsx allProps={allProps} />
                            </Stack>

                            {/* 合計金額 */}
                            <div
                                css={css`
                                margin-top: 32px;
                                margin-bottom: 8px;
                                    text-align:center;
                                    font-size: 1.5rem;
                                `}
                            >{ __('Total price') } </div>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                css={css`  `}
                            >
                                <div css={css` font-size:1.5rem; `}>
                                    { totalPrice.toLocaleString() }
                                    <span css={css` font-size:1rem`}>
                                        { __('JPY (tax included)') }
                                    </span>
                                </div>
                                <div>
                                    { (user.products.length === 0) ?
                                        <LoadingButton variant="outlined"
                                            color="warning"
                                        >
                                            {__('There are no items in your cart.')}
                                        </LoadingButton>
                                    :
                                        <a href={
                                            (disabled || orderProcessing)? '' :
                                            route('user.purchase.index')
                                        }>
                                            <LoadingButton variant="contained"
                                                disabled={disabled}
                                                loading={orderProcessing}
                                                // component={ Link }
                                                // href={ route('user.purchase.index') }
                                            >
                                                {__('Proceed to Checkout')}
                                            </LoadingButton>
                                        </a>
                                    }
                                </div>
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}





// タブレット幅以上での、カート内表示Jsx
function TabletProductsJsx({allProps}) {
    const { user, palette, isMobile } = allProps
    // スマホ幅なら非表示Jsxを返す。
    if (isMobile)  return (<></>)

    return (<>
        { user.products.map((product, i) => (<div key={i}>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                css={css`
                    width: 100%;
                    > :nth-of-type(1) { flex:0.3; }
                    > :nth-of-type(2) { flex:0.1; }
                    > :nth-of-type(3) { flex:0.25; }
                    > :nth-of-type(4) { flex:0.25; }
                    > :nth-of-type(5) { flex:0.1; min-width:160px; }
                `}
            >
                <ImageJsx allProps={ {...allProps, product} } />
                <div>{ product.name }</div>
                {/* <UnitPriceJsx allProps={ {...allProps, product} } /> */}
                <QuantityJsx allProps={ {...allProps, product} } />
                <ProductTotalJsx allProps={ {...allProps, product} } />
                <DeleteButtonJsx allProps={ {...allProps, product} }  />
            </Stack>
            <Hr allProps={allProps} />
        </div>)
        ) }
    </>)
}





// スマホ幅での、カート内表示Jsx
function MobileProductsJsx({allProps}) {
    const { user, palette, isMobile } = allProps
    // スマホ幅でないなら、空のJsxを返す。
    if ( !isMobile ) return (<></>)

    return (<>
        {user.products.map( (product, i) => (<div key={i}>
            <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            >
                <ImageJsx allProps={ {...allProps, product} }/>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}

                >
                    <div>{ product.name }</div>
                    <DeleteButtonMobileJsx allProps={ {...allProps, product} }/>
                </Stack>

                <QuantityJsx allProps={ {...allProps, product} }/>
                <ProductTotalJsx allProps={ {...allProps, product} }/>
            </Stack>
            <Hr allProps={allProps} />
        </div>) )}
    </>)
}





// --- 以下、productsループ系で表示するJsxパーツ ---
// 商品画像jsx
function ImageJsx({allProps}) {
    const { getImageUrl, product } = allProps
    return (<div>
        <img
            src={ getImageUrl(product) }
            css={css`
                object-fit:scale-down;
                aspect-ratio: 5/3;
            `}
        />
    </div>)
}



// 単価 と 商品数量Jsx
function QuantityJsx({allProps}) {
    const { product } = allProps
    return (<div>
            <div css={css` display:inline-block; `}>
                <span css={css` font-size:0.8rem `} >{ __('Unit price') } </span>
                { product.price.toLocaleString() }
                <span css={css` font-size:0.75rem `} >{ __('JPY (tax included)') }</span>
            </div>
            <div css={css` display:inline-block; margin-left:8px; `}>
                { product.pivot.quantity } { __('') }
            </div>
        </div>)
}

// 商品小計Jsx
function ProductTotalJsx({allProps}) {
    const { product } = allProps
    return (<div>
            {
                (product.price * product.pivot.quantity )
                .toLocaleString()
            }
            <span css={css`font-size:0.8rem;`}>{ __('JPY (tax included)') }</span>
        </div>)
}

// 商品カートから削除ボタンJsx（タブレット表示用）
function DeleteButtonJsx({allProps}) {
    const {palette, deleteSubmit, disabled, deleteProcessingId, product} = allProps
    return (<div>
        <LoadingButton startIcon={<DeleteIcon />}
            variant="outlined"
            color="warning"
            disabled={disabled}
            loading={ deleteProcessingId === product.id }
            onClick={ e => deleteSubmit(e, product) }
        >
            { __('Remove from cart') }
        </LoadingButton>
    </div>)
}

// 商品カートから削除ボタンJsx（タブレット表示用）
function DeleteButtonMobileJsx({allProps}) {
    const {
        palette, deleteSubmit, disabled, deleteProcessingId, product
    } = allProps

    return (<div>
        <LoadingButton
            variant="text"
            color="warning"
            disabled={disabled}
            loading={ deleteProcessingId === product.id }
            onClick={ e => deleteSubmit(e, product, ) }
            css={css`
                min-width:auto;
                padding:0;
                margin-bottom: 2px;
            `}
        >
            <DeleteIcon />
        </LoadingButton>
    </div>)
}


// 区切り線のJsx。カート内商品同士を区切る線。
function Hr({allProps}) {
    const { palette, } = allProps
    return (<>
        <hr css={css`
            margin-top: 16px;
            width:100%;
            border-color:${palette.bg3};
        `} />
    </>)
}



