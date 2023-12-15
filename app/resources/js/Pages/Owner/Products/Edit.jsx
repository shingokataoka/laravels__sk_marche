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
        imageDirUrl,
        firstPageImages,
        primaryCategories,
    }) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const errors = usePage().props.errors

    // 「更新する」送信中ならtrue。
    const [processing, setProcessing] = useState(false)
    // ボタンを無効にするならtrue。
    const [disabled, setDisabled] = useState(false)

    const [name, setName] = useState('')
    const [information, setInformation] = useState('')
    const [price, setPrice] = useState(0);
    const [sort_order, setSortOrder] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [secondary_category_id, setSecondaryCategoryId] = useState('')
    // image1〜image4のid
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [is_selling, setIsSelling] = useState(null)


    useEffect(() => {
        if ( processing ) { setDisabled(true) }
        else { setDisabled(false) }
    }, [processing])




    const storeSubmit = e => {
        setProcessing(true)
        router.visit( route('owner.products.store'), {
            method: 'post',
            data: { _token, name, information, price, sort_order, quantity, secondary_category_id, image1, image2, image3, image4, is_selling },
            preserveState: true,
            onFinish: visit => {
                setProcessing(false)
            }
        })
    }



    return (
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Manage Products") +'/'+ __("Register") }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Manage Products") +'/'+ __("Register") } />

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
                                    label={ __('Initial quantity') }
                                    type="number"
                                    value={quantity}
                                    onChange={ e => setQuantity(e.target.value) }
                                    error={ undefined !== errors.name }
                                    helperText={ errors.name }
                                />

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
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 2}) }
                                    column="image2"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage2}
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 3}) }
                                    column="image3"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage3}
                                    disabled={disabled}
                                />
                                <SelectImage
                                    label={ __('Select image :no', {no: 4}) }
                                    column="image4"
                                    firstPageImages={firstPageImages}
                                    imageDirUrl={imageDirUrl}
                                    setImage={setImage4}
                                    disabled={disabled}
                                />


                                <div>
                                    <FormControl css={css`
                                        width:100%;
                                        ${ !errors.is_selling || `
                                            * {
                                                color: ${palette.error.main};
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
                                    onClick={ storeSubmit }
                                >{ __('register') }</LoadingButton>
                                </Stack>
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}

