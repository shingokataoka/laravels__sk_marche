import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

import { DefaultThemeProvider, defaultTheme } from '@/Components/DefaultThemeProvider';
import { Button, css } from '@mui/material';

import { Stack } from '@mui/material';
import InputImageFile from '@/Components/InputImageFile';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';


/** @jsxImportSource @emotion/react */
export default function Create({ auth }) {
    const _token = usePage().props._token
    const errors = usePage().props.errors

    const [title, setTitle] = useState('');

    const oldUrl = '/images/no_image.png'
    const [file, setFile] = useState(null)
    const [fileLoading, setFileLoading] = useState(null)
    const [status, setStatus] = useState(null)
    const [disabled, setDisabled] = useState(null)
    const [processing, setProcessing] = useState(false)



    useEffect(() => {
        setDisabled(processing)
    }, [processing])

    const submitClicked = e => {
        setProcessing(true)
        router.visit( route('owner.images.store'), {
            method: 'post',
            data: {
                _token,
                title,
                image: file,
            },
            reserveState: true,
            onFinish: visit => { setProcessing(false) },
        })
    }


    return (<DefaultThemeProvider>
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Owner") +'/'+ __("Manage Images") +'/'+ __('Add New') }</h2>}
        >
            <Head title={ __("Owner") +'/'+ __("Manage Images") +'/'+ __('Add New') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={4}
                            css={css`
                                max-width:700px;
                                margin: 0 auto;
                            `}
                        >

                            <TextField variant="outlined"
                                label={ __('Title') }
                                value={title}
                                onChange={ e => setTitle(e.target.value) }
                                error={ undefined !== errors.title }
                                helperText={ errors.title }
                            />

                            <InputImageFile
                                ButtonHidden={true}
                                errorText={ errors.image }
                                disabled={disabled}
                                label="画像"
                                oldUrl={oldUrl}
                                file={file} setFile={setFile}
                                fileLoading={fileLoading} setFileLoading={setFileLoading}
                                status={status} setStatus={setStatus}
                            />
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="space-evenly"
                            alignItems="center"
                            spacing={2}
                            css={css` margin-top:64px; `}
                        >
                            <Button variant="contained" color="secondary"
                                disabled={disabled}
                            >{ __('back') }</Button>
                            <LoadingButton variant="contained"
                                loading={ processing }
                                onClick={ submitClicked }
                            >{ __('register') }</LoadingButton>
                        </Stack>


                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    </DefaultThemeProvider>);
}
