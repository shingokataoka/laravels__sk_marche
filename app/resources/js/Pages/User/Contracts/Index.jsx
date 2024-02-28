import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

import { defaultTheme } from '@/Components/DefaultThemeProvider';
import { css } from '@mui/material/styles';

import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';


// ---  dayjsと必要なものをimport ---
import dayjs from "dayjs";
// プラグインが必要
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// tzを有効にする記述
dayjs.extend(utc);
dayjs.extend(timezone);





/** @jsxImportSource @emotion/react */
export default function Index({ auth, isPremium, addDate, cancelDate, lastDate,}) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp =  defaultTheme().breakpoints

    const addDateStr =(addDate)? dayjs(addDate).tz().format('YYYY-MM-DD') : null
    const cancelDateStr =(cancelDate)? dayjs(cancelDate).tz().format('YYYY-MM-DD') : null
    const lastDateStr =(lastDate)? dayjs(lastDate).tz().format('YYYY-MM-DD') : null

    const [processing, setProcessing] = useState(false)


    // 判別用のtatusを取得する。
    // 一度も未契約=none
    // 完全解約済=removed
    // 契約中(キャンセルしてない)=infinity
    // 契約中(キャンセル申請した)=limited
    let status = ''
    // 一度も未契約=none
    if (!isPremium && addDateStr  === null) status = 'none'
    // 完全解約済=removed
    else if (!isPremium && lastDateStr !== null) status = 'removed'
    // 契約中(キャンセルしてない)=infinity
    else if (isPremium && lastDateStr === null) status = 'infinity'
    // 契約中(キャンセル申請した)=limited
    else if (isPremium && lastDateStr !== null) status = 'limited'
console.log('status', status)






    // 「解約する」を押した処理
    const clickedCancel = (e, period) => {
        // アラート「本当にプレミアム会員を解約しますか？」を表示。
        if ( !confirm( __('Do you really want to cancel your premium membership?') ) ) { return }
        // ボタンを読み込み中にする。
        setProcessing(true)
        // 解約処理へdelete送信。
        router.visit( route('user.subscription.destroy'), {
            method:'delete',
            data:{ _token, period},
            // エラーで失敗などしたら、ボタンの読み込み終了。
            onFinish: visit => { setProcessing(false) }
        } );
    }

    const allProps = { palette, bp, isPremium, addDateStr, cancelDateStr, lastDateStr, status, clickedCancel, processing, setProcessing }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{ __("Contract information") }</h2>}
        >
            <Head title={ __("Contract information") } />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="sm:p-6 text-gray-900 dark:text-gray-100">

                            {/* スマホ(tablet幅未満)で表示のJSX */}
                            <div css={css`
                                ${bp.up('tablet')}{ display:none; }
                            `}>
                                <MobileJsx allProps={ allProps } />
                            </div>

                            {/* タブレット幅上で表示のJSX */}
                            <div css={css`
                                ${bp.down('tablet')}{ display:none; }
                                margin: 0 auto;
                                width: 700px;
                                max-width:100%;
                            `}>
                                <CustomizedTables allProps={ allProps } />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}




// スマホ(tablet幅未満)で表示のJSX
function MobileJsx({ allProps }) {
    const { palette, isPremium, addDateStr, status } = allProps

    const stackProps = {
        direction:"column",
        justifyContent:"flex-start",
        alignItems:"stretch",
        spacing:0,
    }
    const stackCss = css`
        border-radius:8px;
        border: 1px ${palette.bg5} solid;
        text-align:center;
        overflow:hidden;
    `

    const titleCss = css`
        background:${palette.bg8};
        color:${palette.bg1};
        padding:8px 0;
    `

    return (<Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={4}
        css={css` margin:8px; `}
    >
        {/* 会員ランク */}
        <Stack {...stackProps} css={ css`${stackCss} font-weight:bold; `  }>
            <div css={titleCss}>{ __('Member rank') }</div>
            <div css={css`padding:8px 0;`}>{ (isPremium)? __('Premium member') : __('General member') }</div>
        </Stack>

        {/* 登録した日 */}
        <Stack {...stackProps} css={stackCss}>
            <div css={titleCss}>{ __('Contract date') }</div>
            <div css={css`padding:8px 0;`}>
                <AddDateJsx allProps={ allProps } />
            </div>
        </Stack>

        {/* 解約した日 */}
        {/* 一度も契約自体なしなら、表示しない。 */}
        { (status === 'none')? '' :
        <Stack {...stackProps} css={stackCss}>
                <div css={titleCss}>{ __('Cancellation date') }</div>

                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    css={css` padding:8px 0; `}
                >
                    {/* 解約日のJSX。完全解約済 なら表示 */}
                    <RemovedDateJsx allProps={allProps} />
                    {/* 「解約する」ボタンのJSX。statusが'infinity'で表示。 */}
                    <InfinityJsx allProps={allProps} />
                    {/* キャンセルを「申請した日」のJSX。status=limitedで表示。 */}
                    <CanceledDateJsx allProps={allProps} />
                    {/* 「解約する<br>（残り期間なし）」ボタンのJSX。statusが'infinity'と'limited'で表示。 */}
                    <RemoveButtonJsx allProps={allProps} />
                </Stack>

            </Stack>
        }

    </Stack>)
}




// PC表示のJSXに必要なもの
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRef, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



// タブレット幅上で表示のJSX
function CustomizedTables({ allProps }) {
    const { palette, isPremium, addDateStr, cancelDateStr, lastDateStr, } = allProps

  return (
    <TableContainer component={Paper}>
         <Table sx={{ minWidth: 200 }} aria-label="customized table"
         >
            <TableHead css={css`
                th {
                    background:${palette.bg8} !important;
                    color: ${palette.bg1} !important;
                    font-weight:bold;
                }
            `}>
                {/* 会員ランク */}
                <TableRow>
                    <StyledTableCell>{ __('Member rank') }</StyledTableCell>
                    <StyledTableCell>
                        { (isPremium)? __('Premium member') : __('General member') }
                    </StyledTableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {/* 登録した日 */}
                <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                        { __('Contract date') }
                    </StyledTableCell>
                    <StyledTableCell>
                        <AddDateJsx allProps={ allProps } />
                    </StyledTableCell>
                </StyledTableRow>

                {/* 解約した日 */}
                {/* 一度も契約なし（解約日なし）。項目「解約日」自体なし。なら表示しない。 */}
                { (!isPremium && addDateStr === null)? '' :

                    <StyledTableRow>
                        <StyledTableCell component="th" scope="row">
                            { __('Cancellation date') }
                        </StyledTableCell>
                        <StyledTableCell>
                            <CancelDateJsx allProps={ allProps } />
                        </StyledTableCell>
                    </StyledTableRow>
                }
            </TableBody>
        </Table>
    </TableContainer>
  );
}



// 登録した日（値側）のJSX
function AddDateJsx({ allProps }) {
    const { isPremium, addDateStr } = allProps

    // 一度も契約なし。プレミアム会員になると送料無料！<br />「登録するボタン」JSX。
    // 契約切れ。プレミアム会員になると送料無料！<br />「登録するボタン」JSX。
    if ( !isPremium ) return (<div>
        <div>プレミアム会員になると送料無料！</div>
        <div css={css`margin-top:8px;`}>
            <a href={ route('user.subscription.index') }>
                <LoadingButton variant="contained">{ __('register') }</LoadingButton>
            </a>
        </div>

    </div>)

    // 契約中（解約日なし）。「登録した日付」JSX。
    // 契約中（解約を送信済）。「登録した日付」JSX
    if ( isPremium ) return (<div>
            { addDateStr }
    </div>)


}


// 解約した日（値側）のJSX
function CancelDateJsx({ allProps }) {
    const { clickedCancel, isPremium, addDateStr, cancelDateStr, lastDateStr, processing } = allProps

    // 一度も契約なし（解約日なし）。項目「解約日」自体なし。
    if (!isPremium && addDateStr  === null) return

    // 契約切れ。「解約した日付」JSX。
    if (!isPremium && lastDateStr !== null) return (<div>
        {lastDateStr}
    </div>)

    // 契約中（解約日なし）。「解約する（残り期間あり）」ボタンと「解約するボタン（残り期間なし）」JSX。
    if (isPremium && lastDateStr === null) return (<div>
        <LoadingButton variant="outlined" color="error"
            loading={ processing }
            onClick={ e => clickedCancel(e, false) }
        >
            { __('Cancel the contract') }
        </LoadingButton>
        <LoadingButton variant="outlined" color="error"
            loading={ processing }
            // 残り期間なし解約なら、trueを渡す。
            onClick={ e => clickedCancel(e, true) }
            css={css`margin-left:16px;`}
        >
            { __('Cancel the contract') }<br />{ __("\"No remaining period\"") }
        </LoadingButton>
    </div>)

    // 契約中（解約を送信済）。「解約した日付」「残りY-m-dまでプレミアム会員」JSX。
    if (isPremium && lastDateStr !== null) return (<Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
    >
        <div>
            { __('The date you applied') }：{ cancelDateStr }
            <br />
            （ { __('Premium membership until :date', {'date':lastDateStr}) } ）
        </div>
        <div>
            <LoadingButton variant="outlined" color="error"
                loading={ processing }
                // 残り期間なし解約なら、trueを渡す。
                onClick={ e => clickedCancel(e, true) }
            >
                { __('Cancel the contract') }<br />{ __("\"No remaining period\"") }
            </LoadingButton>
        </div>
    </Stack>)
}





// 解約日のJSX。完全解約済 なら表示。
function RemovedDateJsx({allProps}) {
    const { lastDateStr, status } = allProps

    // 完全解約済以外なら空のJSXを返す。
    if (status !== 'removed') return ''
    // 解約日を表示。
    return (<div>{lastDateStr}</div>)
}





// 「解約する」ボタンのJSX。statusが'infinity'で表示。
function InfinityJsx({allProps}) {
    const { clickedCancel, processing, status } = allProps

    if (status !== 'infinity') return ''

    return (<LoadingButton variant="outlined" color="error"
            loading={ processing }
            onClick={ e => clickedCancel(e, false) }
        >
            { __('Cancel the contract') }
    </LoadingButton>)
}





// キャンセルを「申請した日」のJSX。status=limitedで表示。
function CanceledDateJsx({allProps}) {
    const { cancelDateStr, lastDateStr, status } = allProps

    // status=limited以外なら非表示。
    if (status !== 'limited') return ''

    return (<div>
        { __('The date you applied') }：{ cancelDateStr }
        <br />
        （ { __('Premium membership until :date', {'date':lastDateStr}) } ）
    </div>)
}




// 「解約する」ボタンのJSX。status='infinity'で表示。
function CanceledButton({allProps}) {
    const { clickedCancel, processing, status } = allProps

    // status='infinity'以外は表示しない。
    if (status !== 'infinity') return ''

    return (<LoadingButton variant="outlined" color="error"
        loading={ processing }
        onClick={ e => clickedCancel(e, false) }
    >
        { __('Cancel the contract') }
    </LoadingButton>)
}





// 「解約する<br>（残り期間なし）」ボタンのJSX。statusが'infinity'と'limited'で表示。
function RemoveButtonJsx({allProps}) {
    const { clickedCancel, processing, status } = allProps

    // statusが'infinity'と'limited'以外なら、表示しない。
    if ( status !== 'infinity' && status !== 'limited' ) return ''

    return (<LoadingButton variant="outlined" color="error"
        loading={ processing }
        // 残り期間なし解約なら、trueを渡す。
        onClick={ e => clickedCancel(e, true) }
    >
        { __('Cancel the contract') }<br />{ __("\"No remaining period\"") }
    </LoadingButton>)

}

