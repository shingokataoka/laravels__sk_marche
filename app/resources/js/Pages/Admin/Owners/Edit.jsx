import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

import { useState } from 'react';
import { defaultTheme } from '@/Components/DefaultThemeProvider';
import {Link} from '@inertiajs/react';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { LoadingButton as Button } from '@mui/lab';


// パスワードのmuiコンポーネント
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';



export default function Edit({ auth, owner, shop }) {
    const palette = defaultTheme().palette
    const _token = usePage().props._token
    const errors = usePage().props.errors

    const [name, setName] = useState(owner.name)
    const [email, setEmail] = useState(owner.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = React.useState(false);

    const formSubmit = e => {
        router.put( route('admin.owners.update', owner.id), {
            _token,
            name,
            email,
            password,
            password_confirmation: confirmPassword,
        })
    }

    // このオーナーのショップがDBになければ表示。
    if (owner.shop === null) return (<AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Admin") +'/'+ __("Owner") + __('Edit') }</h2>}
        >
            <Head title={ __("Admin") +'/'+ __("Owner") + __('Edit') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            このオーナーのショップ情報がありません。<br />
                            確認し直してください。<br />
                            まだ運用していないオーナーなら、削除して作り直す事をお勧めします。
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>)

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Admin") +'/'+ __("Owner") + __('Edit') }</h2>}
        >
            <Head title={ __("Admin") +'/'+ __("Owner") + __('Edit') } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">


                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                            sx={{
                                '& > *': {
                                    width: '100% !important',
                                    maxWidth: '270px',
                                },
                            }}
                        >

                            <TextField label={__('Name')} variant="outlined" name="name" autoComplete="off" error={ undefined !== errors.name}  helperText={errors.name} value={name} onChange={ e => setName(e.target.value) } />

                            <TextField label={__('Email')} variant="outlined" name="email" autoComplete="off" error={ undefined !== errors.email} helperText={errors.email} value={email} onChange={ e => setEmail(e.target.value) } />

                            <TextField label={__('Shop name')} variant="outlined" name="email" autoComplete="off"
                                disabled={true}
                                value={owner.shop.name || 'ここにショップ名が入ります。'}
                            />

                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel error={ undefined !== errors.password} htmlFor="outlined-adornment-password">{  __('Password')}</InputLabel>
                                <OutlinedInput
                                    error={ undefined !== errors.password}
                                    onChange={ e => setPassword(e.target.value) }
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={ () => setShowPassword((show) => !show)}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="{  __('Password')}"
                                />
                                <FormHelperText error >
                                    {errors.password}
                                </FormHelperText>
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">{  __('Confirm Password')}</InputLabel>
                                <OutlinedInput
                                    value={confirmPassword}
                                    onChange={ e => setConfirmPassword(e.target.value) }
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={ () => setShowPassword((show) => !show)}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label={  __('Confirm Password')}
                                />
                            </FormControl>

                        </Stack>


                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={24}
                            sx={{
                                marginTop: 6,
                                marginBottom: 3,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                component={ Link }
                                href={ route('admin.owners.index') }
                            >
                                { __('back') }
                            </Button>
                            <Button
                                variant="contained"
                                onClick={ e => formSubmit(e) }
                            >
                                { __('update') }
                            </Button>
                        </Stack>








                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
