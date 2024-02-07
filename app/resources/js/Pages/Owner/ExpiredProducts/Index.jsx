import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { DefaultThemeProvider } from '@/Components/DefaultThemeProvider';
import { css } from '@emotion/react';

import { router } from '@inertiajs/react';

import {Link} from '@inertiajs/react';
import { Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import {Button} from '@mui/material';

import SelectCategory from '@/Components/SelectCategory';

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
export default function Index({ auth, products, productDirUrl, primaryCategories, initialCategoryId, initialKeyword, initialSortType }) {
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const SORT_ORDER = usePage().props.Constant.SORT_ORDER
    const [disabled, setDisabled] = useState(false)

    const [categoryId, setCategoryId] = useState(initialCategoryId)

    const [keyword, setKeyword] = useState(initialKeyword)
    const [sortType, setSortType] = useState(initialSortType)


    // 検索とページネーションの連動が必要。
    // 検索時は1ページだから連動は不要。
    const clickedSearch = e => {
        router.visit( route('owner.expired-products.index'), {
            method: 'get',
            data: { categoryId, keyword, sortType }
        }

        )
        console.log('search')
    }
    // 検索後にページめくりは、検索結果と連動が必要。
    const PaginationChange = (e, page) => {
        router.visit( route('owner.expired-products.index'), {
            method: 'get',
            data: {page, categoryId, keyword, sortType },
        })
    }


    const CategoryComponent = (<SelectCategory
        className="CategoryComponent"
        primaryCategories={primaryCategories}
        secondary_category_id={categoryId}
        setSecondaryCategoryId={setCategoryId}
    />)

    const KeywordComponent = (<TextField
        className="KeywordComponent"
        label={ __('Keyword') }
        type="text"
        value={keyword}
        onChange={ e => setKeyword(e.target.value) }
    />)



    const SearchButton = (<LoadingButton variant="contained" color="info"
        className="SearchButton"
        onClick={ clickedSearch }
    >{ __('search') }</LoadingButton>)


    const SortOrderComponent = (<FormControl className="SortOrderComponent">
        <InputLabel id="demo-simple-select-label">{ __('Display order') }</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortType}
            label={ __('Sort') }
            onChange={ e => setSortType(e.target.value) }
        >
            <MenuItem value={SORT_ORDER.recommend}>{ __('Recommend') }</MenuItem>
            <MenuItem value={SORT_ORDER.higher_price}>{ __('Higher price') }</MenuItem>
            <MenuItem value={SORT_ORDER.lower_price}>{ __('Lower price') }</MenuItem>
            <MenuItem value={SORT_ORDER.later}>{ __('Later') }</MenuItem>
            <MenuItem value={SORT_ORDER.older}>{ __('Older') }</MenuItem>
            <MenuItem value={SORT_ORDER.deleted_later}>{ __('Deleted Later') }</MenuItem>
            <MenuItem value={SORT_ORDER.deleted_older}>{ __('Deleted Older') }</MenuItem>
        </Select>
        </FormControl>)



    return (<DefaultThemeProvider>
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Expired Products") }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Expired Products") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* スマホ幅での検索ウィンドウ */}
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        css={css`
                            ${bp.up('tablet')} { display:none; }
                            padding: 0 16px 32px 16px;
                            #SearchButton { width:100%; }
                        `}
                    >
                        { CategoryComponent }
                        { KeywordComponent }
                        { SortOrderComponent }
                        <div css={css`padding:32px 0;`}>
                            { SearchButton }
                        </div>
                    </Stack>

                    {/* タブレット幅以上での検索ウィンドウ */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        css={css`
                            ${bp.down('tablet')} { display:none; }
                            .CategoryComponent { div { width:200px; } }
                            .KeywordComponent { flex:1; }
                            .SearchButton } width: 118px; }
                            .SortOrderComponent { width: 190px; }
                        `}
                    >
                        { CategoryComponent }
                        { KeywordComponent }
                        { SearchButton }
                        { SortOrderComponent }
                    </Stack>



                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 max-w-[790px] mx-auto">



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
        href={ route('owner.expired-products.show', {'expired_product': product.id}) }
        css={css`
            margin-top: 8px;
            border: 1px ${palette.bg4} solid;
            border-radius: 8px;
            width: 205px;
            min-width: 135px;
            overflow: hidden;
            font-size: 0.9rem;
        `}
    >
        <Stack alignItems="center" >
            <img
                src={ url }
                css={css`
                    max-width: 205px;
                    max-height: 135px;
                `}
            />
        </Stack>
        <div css={css` padding:8px; `}>
            <div>{ product.name }</div>
            <div>{ product.secondary_category.name }</div>
            <div>{ product.price.toLocaleString() } 円</div>
            <div>{ __('Deleted at') }：{ dayjs(product.deleted_at).tz().format('YYYY-MM-DD') }</div>
        </div>
    </Link>);

}

