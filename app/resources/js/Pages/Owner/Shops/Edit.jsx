import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

import { useEffect, useState } from 'react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { Button, Stack, css } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import InputImageFile from '@/Components/InputImageFile';


import { TextField } from '@mui/material';
import { Link } from '@inertiajs/react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';




/** @jsxImportSource @emotion/react */
export default function Edit({ auth, shop, oldUrl }) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const errors = usePage().props.errors

    // 「更新する」送信中ならtrue。
    const [processing, setProcessing] = useState(false)
    // ボタンを無効にするならtrue。
    const [disabled, setDisabled] = useState(false)

    const [name, setName] = useState(shop.name)
    const [information, setInformation] = useState(shop.information)
    const [is_selling, setIsSelling] = useState(shop.is_selling)

    // -- 画像コンポーネントに渡すステート --
    // 選択ファイル。
    const [file, setFile] = useState(null)
    // 読み込み中のステート。true false。
    const [fileLoading, setFileLoading] = useState(false)
    // 変更区別のステート。'none' 'old' 'new'。
    const [status, setStatus ] = useState('old')


    useEffect(() => {
        if ( processing || fileLoading ) { setDisabled(true) }
        else { setDisabled(false) }
    }, [processing, fileLoading])



    const updateSubmit = e => {
        setProcessing(true)
        router.visit( route('owner.shops.update', {shop: shop.id}), {
            method: 'post',
            data: {
                _token,
                // forceFormData: true,
                name, information,
                file: file,
                is_selling,
                status,
            },
            preserveState: true,
            onFinish: visit => {
                setProcessing(false)
            },
         })
    }



    return (
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Store Information") +'/'+ __("Edit") }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Store Information") +'/'+ __("Edit") } />

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

                                <InputImageFile
                                    errorText={errors.file}
                                    disabled={ disabled }
                                    label={ __('Image') }
                                    oldUrl={oldUrl}
                                    file={ file } setFile={ setFile }
                                    fileLoading={fileLoading} setFileLoading={setFileLoading}
                                    status={status} setStatus={setStatus}
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
                                    href={ route('owner.shops.index') }
                                >{ __('back') }</Button>

                                <LoadingButton variant="contained"
                                    disabled={disabled}
                                    loading={ processing }
                                    onClick={ updateSubmit }
                                >{ __('update') }</LoadingButton>
                                </Stack>
                            </Stack>

                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}

