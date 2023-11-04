// MUIの本当のデフォのthemeを使わず、多分CSSリセットしてる。
// このCssBaseLineを先頭に書かないとバグる
import CssBaseline from '@mui/material/CssBaseline';

import * as colors from "@mui/material/colors";
import { createTheme } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material';


// breakpointsを設定（レスポンシブなどに対応するためのもの）
// mui公式のものをコピペした。
// mui公式リンク「https://mui.com/material-ui/customization/breakpoints/#:~:text=Feel%20free%20to%20have%20as%20few%20or%20as%20many%20breakpoints%20as%20you%20want%2C%20naming%20them%20in%20whatever%20way%20you%27d%20prefer%20for%20your%20project.」
const breakpointsObj = {
    breakpoints: {
        values: {
          mobile: 0,        // スマホ幅以上（タブレット幅未満）
          tablet: 640,      // タブレット幅以上（ノートPC幅未満）
          laptop: 1024,     // ノートPC幅以上（デスクトップPC幅未満）
          desktop: 1200,    // デスクトップPC幅以上
        },
      },
}

// ●lightモード時の自作デフォルトthemeのカラーを指定
const lightTheme = {
    palette: {
        // lightモードのデフォルトthemeにオーバーライドを指定
        mode: 'light',
        text: { primary: '#333' },  // デフォルト（primaryの？）全体のフォントカラー
        // background: {
        //     default: '#fff',     // デフォルトの背景色
        // },
        // 自作カラー。デフォ以外の背景色
         bg1: colors.grey[100],
         bg2: colors.grey[200],
         bg3: colors.grey[300],
         bg4: colors.grey[400],
         bg5: colors.grey[500],
    }
}



// ●darkモード時のthemeのカラーを指定
const darkTheme = {
    palette: {
        // darkモードのデフォルトthemeにオーバーライドを指定
        mode: 'dark',
        text: { primary: '#eee' },  // デフォ（primaryの？）全体のフォントカラー
        // background: {
        //     default: '#030303',     // デフォルトの背景色
        // },
        // 自作カラー。デフォ以外の背景色
         bg1: colors.grey[900],
         bg2: colors.grey[800],
         bg3: colors.grey[700],
         bg4: colors.grey[600],
         bg5: colors.grey[500],
    }
}


// ダークモードならtrueを返す。以外はfalseを返す。
export function isDark() {
    // ダークモード=true、普通モード=false を取得
		// useMediaQuery()は、コンポーネントまたはカスタムフック内のトップレベルに書くこと
        const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
        // 手動で設定の場合（カラー確認用）
        // const prefersDarkMode = true

        return prefersDarkMode
}


// ●ダークモードか自動判別して自作デフォルトthemeを返す関数
export function defaultTheme() {
    // darkかlightどちらか対応した方のthemeを取得
    const themeObj = isDark() ? darkTheme : lightTheme

    return createTheme({
        ...themeObj,
        ...breakpointsObj,
    })
}


// ●DefaultThemeProviderコンポーネントを返す
// このコンポーネントで囲むと、中身は自作デフォルトthemeの配色になる。
// laravel+breeze+Reactでは、トップの<App>を囲めない（バグる）から、
// Layout系コンポーネントを囲むなどで、全てに適用させる
export function DefaultThemeProvider(props) {
    const theme = defaultTheme()

    return (<>
        <ThemeProvider theme={ theme }>
						{/* CssBaseLine(MUIのリセットCSS)をしないと一部適用されない */}
            <CssBaseline />
                { props.children }
        </ThemeProvider>
        </>)
}
