import { Link, Head } from '@inertiajs/react';

import { defaultTheme, DefaultThemeProvider } from '@/Components/DefaultThemeProvider';
import { css } from '@mui/material';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import nl2br from '@/Functions/nl2br';

/** @jsxImportSource @emotion/react */
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const palette = defaultTheme().palette

    return (<DefaultThemeProvider>
            <Head title="Welcome" />

            {/* ロゴ画像 */}
            <Stack
                direction="row"
                justifyContent="center"
                css={css`
                    background:${palette.bg2}
                `}
            >
                <img src="logo.png" />
            </Stack>


            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                css={css`
                    margin:0 auto;
                    max-width: 1200px;
                    padding:32px 16px;
                `}
            >
                <h1 css={css`
                    font-size:2rem;
                `}>Stripe（テスト環境）を決済導入したECサイト</h1>

                <div css={css`font-size:1.5rem;`}>Laravel breeze + Inertia + Reactで制作</div>

                <div css={css`text-align:center;`}>{ nl2br(`
                    laravelのCashierによるStripe決済を導入してECサイトを構築してみました。
                    このCashier + Stripeのサブスク契約機能を使い、プレミアム会員（送料無料）も実装しました。

                    ダークモードにも対応しています。
                    （PC側をダークモードにしてください。）

                `) }</div>

                <div css={css`
                    text-align:center;
                    width:400px;
                    background:${palette.bg2};
                    text-align:center;
                    padding:16px;
                `}>
                    <span css={css`font-size:1.5rem;`}>テスト用ユーザー</span><br/ >
                    <br/ >
                    当サイトはポートフォリオです。<br/ >
                    <span css={css`text-decoration:underline;`}>遠慮なくログイン</span>していただければ幸いです。<br/ >
                    <br/ >

                    <hr css={css` margin:8px 0; border-color:${palette.bg4}; `} />
                    メールアドレス :	user1@test.com<br/ >
                    パスワード :	user1111<br/ >
                    <LoadingButton variant="contained" component={Link}
                        href={ route('login') }
                    >一般ユーザー<br />ログインページ</LoadingButton>

                    <hr css={css` margin:8px 0; border-color:${palette.bg4}; `} />
                    メールアドレス :	owner1@test.com<br/ >
                    パスワード :	owner1111<br/ >
                    <LoadingButton variant="contained" component={Link}
                        href={ route('owner.login') }
                    >ショップオーナー<br />ログインページ</LoadingButton>

                    <hr css={css` margin:8px 0; border-color:${palette.bg4}; `} />
                    メールアドレス :	admin1@test.com<br/ >
                    パスワード :	admin1111<br/ >
                    <LoadingButton variant="contained" component={Link}
                        href={ route('admin.login') }
                    >ECシステム管理者<br />ログインページ</LoadingButton>


                </div>





            </Stack>




    </DefaultThemeProvider>);

}
