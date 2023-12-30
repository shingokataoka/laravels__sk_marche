import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { DefaultThemeProvider } from '@/Components/DefaultThemeProvider';
import { css } from '@emotion/react';

import nl2br from '@/Functions/nl2br';

import { router } from '@inertiajs/react';

import {Link} from '@inertiajs/react';
import { Stack, useMediaQuery } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import {Button} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import SelectCategory from '@/Components/SelectCategory';
import ImageCaroucel from '@/Components/ImageCaroucel';

import {TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// セレクトボックス
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


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
export default function Dashboard({ auth, product, maxQuantity, imageUrls, shop, shopImageUrl }) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints
    const [processing, setProcessing] = useState(false)

    const [quantity, setQuantity] = useState(0);

    // 「カートに入れる」を押した処理
    const cartSubmit = e => {
        // 指定の数量が0なら送信しない。
        if (quantity <= 0) {
            alert( __('Purchase quantity not specified.') )
            return
        }
        setProcessing(true)
        router.visit( route('user.cart.store'), {
            method: 'post',
            data: {
                _token,
                product_id: product.id,
                quantity,
            },
            onFinish: visit => {
                setProcessing(false)
            }
        }

        )
    }



    // 商品情報のJSX
    const ProductJsx = (<>
        <div css={css` color:${palette.text.disabled} `}>{ product.secondary_category.name }</div>
        <div css={css`
            font-size: 2rem;
            padding: 16px 0;
        `}>{ product.name }</div>
        <div>{ nl2br(product.information) }</div>
    </>)

    // 価格を表示
    const PriceJsx = (<div css={css` font-size:1.7rem; `}>
        { product.price.toLocaleString() }
        <span css={css`font-size:0.85rem;`}>{ __('Yen (tax included)') }</span>
    </div>)

    // 「数量」入力欄
    const QuantityJsx = (<SelectQuantity
        maxQuantity={ maxQuantity }
        quantity={quantity} setQuantity={setQuantity}
    />)

    // 「カートに入れる」or「っ在庫切れ中」ボタン
    const CartButtonJsx = (maxQuantity === 0)?
        (<LoadingButton variant="outlined" color="warning"
            startIcon={<RemoveShoppingCartIcon />}
            onClick={ e => false }
        >
            { __('Out of stock') }
        </LoadingButton>)
        :
        (<LoadingButton variant="contained"
           startIcon={<ShoppingCartIcon />}
           loading={ processing }
           onClick={ cartSubmit }
        >
            { __('Add to cart') }
        </LoadingButton>)




    return (<DefaultThemeProvider>
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __('Product details') }</h2>}
        >
            <Head title={ __('Product details') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* スマホ幅で表示 */}
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                                css={css` ${bp.up('tablet')} { display:none; } `}
                            >
                                {/* 商品画像 */}
                                <ImageCaroucel imageUrls={imageUrls} />
                                {/* 商品情報 */}
                                { ProductJsx }
                                {/* 価格と数量 */}
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    { PriceJsx }
                                    { QuantityJsx }
                                </Stack>
                                {/* ボタン */}
                                { CartButtonJsx }
                            </Stack>

                            {/* タブレット幅以上で表示 */}
                            <Stack
                                direction="row"                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={2}
                                css={css` ${bp.down('tablet')} { display:none; } `}
                            >
                                {/* 商品画像（左側） */}
                                <div css={css`width:50%; max-width:500px;`}>
                                    <ImageCaroucel imageUrls={imageUrls} />
                                </div>
                                {/* 商品情報 + 価格や個数とボタン(右側) */}
                                <Stack
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={2}
                                    css={css`padding: 16px 0; `}
                                >
                                    { ProductJsx }
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                    { PriceJsx }
                                    { QuantityJsx }
                                    { CartButtonJsx }
                                    </Stack>
                                </Stack>
                            </Stack>


                            <hr css={css`
                                margin: 32px 0 ;
                                border-color: ${palette. bg4};
                            `} />


                            {/* ショップ情報 */}
                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                                css={css` margin-bottom:32px;`}
                            >
                                <div>{ __('Shops selling this product') }</div>
                                <div>{ shop.name }</div>
                                <img src={shopImageUrl}
                                    css={css`
                                        width:160px;
                                        height:160px;
                                        object-fit:cover;
                                        border-radius:100px;
                                    `}
                                />
                                <ShopModal
                                    shop={ shop }
                                />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    </DefaultThemeProvider>);
}




function SelectQuantity({maxQuantity, quantity, setQuantity}) {


// 数量の配列
const range = []
for (let i=0; i<=maxQuantity; i++) range.push(i)

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{ __('Quantity') }</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={quantity}
          onChange={ e => setQuantity(e.target.value) }
          autoWidth
          label={ __('Quantity') }
            css={css`
                text-align:right;
            `}

        >{ range.map(row => (
          <MenuItem key={row} value={row}
            css={css`
                display:block;
                text-align:right;
            `}
        >{row} { __("") }</MenuItem>
        ))}</Select>
      </FormControl>
    </div>
  );
}




import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';


function ShopModal({ shop }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    const palette = defaultTheme().palette


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: `1px ${palette.bg3} solid`,
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };


  return (
    <div>
        <Button variant="contained" color="secondary"
          onClick={handleOpen}
        >{ __('View shop details')}</Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              { shop.name }
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              { nl2br(shop.information) }
            </Typography>
            <Button variant="contained" color="secondary"
                onClick={ handleClose }
            >{ __('Close') }</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
