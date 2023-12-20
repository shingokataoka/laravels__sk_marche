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
export default function Edit({
        auth,
        product,
        current_quantity,
        imageDirUrl,
        firstPageImages,
        primaryCategories,
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
        setProcessing(true)
        router.visit( route('owner.products.update', {'product':product.id}), {
            method: 'post',
            data: { _token, name, information, price, sort_order, type, quantity, secondary_category_id, image1, image2, image3, image4, is_selling },
            preserveState: true,
            onFinish: visit => {
                setProcessing(false)
            }
        })
    }


    const deleteSubmit = e => {
        if ( !confirm( __('Becomes an \"deleted product\". \r\nDo you want to run it?') ) ) return
        setDeleteProcessing(true)
        router.visit( route('owner.products.destroy', {product: product.id}), {
            method: 'delete',
            data: {_token}
        } )
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
                                    onChange={ e => setName(e.target.value) }
                                    error={ undefined !== errors.name }
                                    helperText={ errors.name }
                                />

                                <TextField
                                    multiline
                                    minRows={4}
                                    maxRows={8}
                                    variant="outlined"
                                    label={ __('Information') }
                                    value={ information }
                                    onChange={ e => setInformation(e.target.value) }
                                    error={ undefined !== errors.information }
                                    helperText={ errors.information }
                                />

                                <TextField variant="outlined"
                                    label={ __('Price') }
                                    type="number"
                                    value={price}
                                    onChange={ e => setPrice(e.target.value) }
                                    error={ undefined !== errors.price }
                                    helperText={ errors.price }
                                />

                                <TextField variant="outlined"
                                    label={ __('Sort order') }
                                    type="number"
                                    value={sort_order}
                                    onChange={ e => setSortOrder(e.target.value) }
                                    error={ undefined !== errors.sort_order }
                                    helperText={ errors.sort_order }
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
                                        onChange={ e => setType(e.target.value) }
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
                                        onChange={ e => setQuantity(e.target.value) }
                                        error={ undefined !== errors.quantity }
                                        helperText={ errors.quantity }
                                        css={css`
                                            width: 100%;
                                        `}
                                    />
                                </div>


                                <SelectCategory
                                    primaryCategories={primaryCategories}
                                    secondary_category_id={secondary_category_id}
                                    setSecondaryCategoryId={setSecondaryCategoryId}
                                />

                                <SelectImage
                                    label={ __('Select image :no', {no: 1}) }
                                    column="image1"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage1}
                                    oldFilename={ (!product.image_1)? null :product.image_1.filename }
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 2}) }
                                    column="image2"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage2}
                                    oldFilename={ (!product.image_2)? null :product.image_2.filename }
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 3}) }
                                    column="image3"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage3}
                                    oldFilename={ (!product.image_3)? null :product.image_3.filename }
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 4}) }
                                    column="image4"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage4}
                                    oldFilename={ (!product.image_4)? null :product.image_4.filename }
                                    disabled={disabled}
                                />


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
                                        onChange={ e => setIsSelling(e.target.value) }
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
                                        href={ route('owner.products.index') }
                                    >{ __('back') }</Button>

                                    <LoadingButton variant="contained"
                                        disabled={disabled}
                                        loading={ processing }
                                        onClick={ updateSubmit }
                                    >{ __('update') }</LoadingButton>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-around"
                                    alignItems="center"
                                    spacing={2}
                                    css={css` padding-top: 16px; `}
                                >
                                    <LoadingButton variant="contained" color="error"
                                        loading={ deleteProcessing }
                                        disabled={ disabled }
                                        onClick={ deleteSubmit }
                                    >{ __('Delete') }</LoadingButton>
                                </Stack>
                            </Stack>



                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}

