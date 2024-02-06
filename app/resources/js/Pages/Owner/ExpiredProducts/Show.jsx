import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

import { useEffect, useState } from 'react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { Button, Stack, css } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SelectCategory from '@/Components/SelectCategory';
import SelectImage from '@/Components/SelectImage';

import { TextField } from '@mui/material';
import { Link } from '@inertiajs/react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';




/** @jsxImportSource @emotion/react */
export default function Show({
        auth,
        product,
        current_quantity,
        imageDirUrl,
        firstPageImages,
        primaryCategories,
        productImageUrls,
    }) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const errors = usePage().props.errors
    const Constant = usePage().props.Constant

    // 「更新する」送信中ならtrue。
    const [processing, setProcessing] = useState(false)
    // 「削除」送信中ならtrue。
    const [deleteProcessing, setDeleteProcessing] = useState(false)
    // ボタンを無効にするならtrue。
    const [disabled, setDisabled] = useState(false)

    const [name, setName] = useState(product.name)
    const [information, setInformation] = useState(product.information)
    const [price, setPrice] = useState(product.price);
    const [sort_order, setSortOrder] = useState(product.sort_order);
    const [quantity, setQuantity] = useState(0);
    const [secondary_category_id, setSecondaryCategoryId] = useState(product.secondary_category_id)
    // image1〜image4のid
    const [image1, setImage1] = useState(product.image1);
    const [image2, setImage2] = useState(product.image2);
    const [image3, setImage3] = useState(product.image3);
    const [image4, setImage4] = useState(product.image4);

    const [is_selling, setIsSelling] = useState(product.is_selling)

    // 追加or削減
    const [type, setType] = useState( Constant.PRODUCT.add );


    // どれかが送信中ならdisabled=trueにする
    useEffect(() => {
        if ( processing ) { setDisabled(true) }
        else if ( deleteProcessing ) { setDisabled(true) }
        else { setDisabled(false) }
    }, [processing, deleteProcessing])




    const updateSubmit = e => {
        if ( !confirm( __("It will be “product managed”. \r\nDo you want to run it?") ) ) return
        setProcessing(true)
        router.visit( route('owner.expired-products.update', {'expired_product':product.id}), {
            method: 'put',
            data: { _token, },
            preserveState: true,
            onFinish: visit => {
                setProcessing(false)
            }
        })
    }




    return (
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Manage Products") +'/'+ __("Edit") }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Manage Products") +'/'+ __("Edit") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <Stack
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={4}
                                css={css`
                                    > * {
                                        width: 100%;
                                        max-width: 700px;
                                    }
                                `}
                            >
                                <TextField variant="outlined"
                                    label={ __('Name') }
                                    type="text"
                                    value={name}
                                    inputProps={{ readOnly: true }}
                                />

                                <TextField
                                    multiline
                                    minRows={4}
                                    maxRows={8}
                                    variant="outlined"
                                    label={ __('Information') }
                                    value={ information }
                                    inputProps={{ readOnly: true }}
                                />

                                <TextField variant="outlined"
                                    label={ __('Price') }
                                    type="number"
                                    value={price}
                                    inputProps={{ readOnly: true }}
                                />

                                <TextField variant="outlined"
                                    label={ __('Sort order') }
                                    type="number"
                                    value={sort_order}
                                    inputProps={{ readOnly: true }}
                                />

                                <TextField variant="outlined"
                                    label={ __('Current quantity') }
                                    type="number"
                                    // inputProps={{ readOnly: true }}
                                    disabled={true}
                                    value={current_quantity}
                                />

                                <div css={css`

                                `}>
                                    <FormControl css={css`
                                        width: 100%;
                                        * { border: none !important; }
                                    `}>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={type}
                                        css={css`
                                            display: flex;
                                            justify-content: space-around;
                                            border: 1px ${palette.bg3} solid;
                                            border-radius: 4px;
                                        `}

                                    >
                                        <FormControlLabel control={<Radio />}
                                            label={ __('add quantity') }
                                            value={ Constant.PRODUCT.add }
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            label={ __('reduce quantity') }
                                            value={ Constant.PRODUCT.reduce }
                                        />
                                    </RadioGroup>
                                    </FormControl>

                                    <TextField variant="outlined"
                                        label={ __('Quantity') }
                                        type="number"
                                        value={quantity}
                                        inputProps={{ readOnly: true }}
                                        css={css`
                                            width: 100%;
                                        `}
                                        readOnly={true}
                                    />
                                </div>


                                <SelectCategory
                                    primaryCategories={primaryCategories}
                                    secondary_category_id={secondary_category_id}
                                    setSecondaryCategoryId={setSecondaryCategoryId}
                                    readOnly={true}
                                />

                                { productImageUrls.map( (url, i) => (<fieldset key={i}
                                    css={css`
                                        border:1px ${palette.bg3} solid;
                                        padding: 8px 16px 16px 16px;
                                        border-radius:4px;
                                        color: ${palette.bg6};
                                    `}
                                >
                                    <legend css={css`
                                        padding: 0 6px;
                                        font-size:0.8rem;
                                    `}>
                                        { __('Image') }{ i+1 }
                                    </legend>
                                    <Stack
                                        justifyContent="center"
                                        alignItems="center"
                                        css={css`
                                            width: 128px; height: 128px;
                                            background: ${ palette.bg2 };
                                            ${bp.down('tablet')} {
                                                width: 100px; height: 100px;
                                            }
                                        `}
                                    >
                                        <img
                                            src={ url }
                                            css={css`
                                                max-width: 100%; max-height: 100%;
                                            `}
                                        />
                                    </Stack>
                                </fieldset>) )}




                                <div>
                                    <FormControl css={css`
                                        width:100%;
                                        ${ !errors.is_selling || `
                                            * {
                                                border-color:${palette.error.main} !important;
                                            }
                                        ` }
                                    `}>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={is_selling}
                                        css={css`
                                            display: flex;
                                            justify-content: space-around;
                                            border: 1px ${palette.bg3} solid;
                                            border-radius: 4px;
                                        `}
                                    >
                                        <FormControlLabel value={1} control={<Radio />} label={ __('On Sale') } />
                                        <FormControlLabel value={0} control={<Radio />} label={ __('Sales Stopped') }
                                        />
                                    </RadioGroup>
                                    </FormControl>
                                    <div css={css`
                                        color:${palette.error.main};
                                        font-size: 0.85rem;
                                    `}>{errors.is_selling}</div>
                                </div>

                                <Stack
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                    spacing={2}
                                    css={css` padding-top: 16px; `}
                                >
                                    <Button variant="contained" color="secondary"
                                        disabled={ disabled }
                                        component={Link}
                                        href={ route('owner.expired-products.index') }
                                    >{ __('back') }</Button>

                                    <LoadingButton variant="contained"
                                        disabled={disabled}
                                        loading={ processing }
                                        onClick={ updateSubmit }
                                    >{ __('Restore') }</LoadingButton>
                                </Stack>

                            </Stack>



                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}

