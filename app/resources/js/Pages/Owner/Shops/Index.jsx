import OwnerAuthenticatedLayout from '@/Layouts/OwnerAuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { Button, Container, Typography } from '@mui/material';
import {Link} from '@inertiajs/react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { css } from '@mui/material';

/** @jsxImportSource @emotion/react */
export default function Dashboard({ auth, shop, imageUrl }) {
    const palette = defaultTheme().palette

    const saleCss = css`
        display: inline-block;
        background: red;
        padding: 7px 8px;
        border-radius: 4px;
        font-size: 0.95rem;
    `

    return (
        <OwnerAuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{  __('Owner') +'/'+ __("Store Information") }</h2>}
        >
            <Head title={  __('Owner') +'/'+ __("Store Information") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <Link
                                href={ route('owner.shops.edit', shop.id) }
                                css={css`
                                    display: block;
                                    background: ${palette.bg2};
                                    padding: 16px;
                                    border-radius: 8px;
                                    max-width: 500px;
                                    transition: all 0.25s;
                                    :hover {
                                        background: ${palette.bg3};
                                    }
                                `}
                            >
                                {!!shop.is_selling &&
                                <div
                                    css={css`
                                        ${saleCss}
                                        background: ${palette.primary.main};
                                        color: ${palette.primary.contrastText};
                                    `}
                                >{ __('On Sale') }</div>
                                }
                                {!shop.is_selling &&
                                <div
                                    css={css`
                                        ${saleCss}
                                        background: ${palette.error.main};
                                        color: ${palette.error.contrastText};
                                    `}
                                >{ __('Sales Stopped') }</div>
                                }

                                <br />

                                <div style={{ marginTop:'16px' }} >{ shop.name }</div>

                                <img src={ imageUrl }
                                    style={{
                                        marginTop: '16px',
                                    }}
                                />
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </OwnerAuthenticatedLayout>
    );
}
