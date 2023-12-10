
import { defaultTheme } from "@/Components/DefaultThemeProvider"
import { css } from "@emotion/react"

import { router } from "@inertiajs/react"
import {usePage} from "@inertiajs/react"
import { useState } from "react"
import { useEffect } from "react"

import { Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"

import {Stack} from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';


/** @jsxImportSource @emotion/react */
export default function InputImageFile({
    // 「画像なしにする」ボタン非表示にする。
    ButtonHidden,
    // 親からerrorを受け取る。
    errorText,
    // 親要素側から無効ならtrue
    disabled,
    // fieldsetタグのlegendタグのラベル文字
    label,
    // 元画像のURL。
    oldUrl,
    // 選択ファイル。
    file, setFile,
    // 読み込み中のステート。true false。
    fileLoading, setFileLoading,
    // 変更区別のステート。'none' 'old' 'new'。
    status, setStatus,
}) {
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const errors = usePage().props.errors

    // 表示する画像のURL。
    const [url, setUrl] = useState(oldUrl)
    // デフォのファイル選択を閉じたかステート。true false。
    const [closed, setClosed] = useState(false)

    // ボタン押し時やドロップ時の読み込み遅延時間。
    const delayTime = 400


    // ---「画像なしにする」ボタン押した時の処理 ---
    // 状態='none'にする。
    const buttonClicked = e => {
        setStatus('none')  // 状態を画像なしにする。
        setFileLoading(true)  //  読み込み中にする。
        // 読み込み解除を、遅延で行う。（見た目のため）
        setTimeout(() => { setFileLoading(false) }, delayTime)
    }


    // --- ドロップ時の処理 ---
    // 状態='new'、ファイルを変更をする。
    const fileDrop = e => {
        e.preventDefault() // 別タブでファイルが開くのを防ぐ。
        e.stopPropagation() // 親要素へのイベント伝播を防ぐ。
        if ( disabled ) return    // 親が送信中なら処理しない。
        if ( fileLoading ) return  // 読み込み中なら処理しない。
        const newFile = e.dataTransfer.items[0].getAsFile()  // ファイルを取得する。
        if ( newFile.type.indexOf('image/') !== 0 ) return   // 画像でないなら処理しない。

        setFile( newFile )  // ステートにファイルを入れる。
        setStatus('new')    // 状態を新規ファイルにする。
        setFileLoading(true)    // 読み込み中にする。
        // 読み込み解除を、遅延で行う。（見た目のため）
        setTimeout(() => { setFileLoading(false) }, delayTime)
    }


    // --- デフォinput file を をクリックした瞬間時の処理 ---
    // 紐づけたlabelタグをクリックも発火する。
    // デフォの「ファイル選択ウィンドウ」が開く直前に用意の処理。
    // 状態='old'、にしておく。（キャンセルハンドラないので、最初をキャンセルの値にしとく。）
    const inputClicked = e => {
        e.stopPropagation() // 親要素へのイベント伝播をキャンセル。
        // 親が送信中ならデフォの「ファイル選択」を防ぎ、処理しない。
        if ( disabled ) { e.preventDefault(); return }
        // 読み込み中ならデフォの「ファイル選択」を防ぎ、処理しない。
        if ( fileLoading ) { e.preventDefault(); return }
        setFileLoading(true)    // 読み込み中にする。
        // setFile(null)
        setStatus('old')    // 状態='old'にする。（「キャンセル」の値にしとく。）
        setClosed(true)     // デフォの「ファイル選択ウィンドウ」を閉じた状態にセット。
    }


    // --- デフォのファイル変更時の処理 ---
    // 状態='new'、ファイルを変更する。
    const fileChange = e => {
        const newFile = e.target.files[0]
        // - 画像じゃないなら処理しない。（状態='old'のままになる。）
        if ( newFile.type.indexOf('image/') !== 0 ) return
        setFile(newFile)    // - ファイルを変更する。
        setStatus('new')    // - 変更区別の値を’new'にする。
        // - input file のvalueを’’にする。次回同じファイルを選択した場合でも発火させるため。
        e.target.value = ''
    }

    // --- デフォの「ファイル選択ウィンドウ」を閉じた時に、読み込み中を終了する。 ---（どんな状態で閉じても確実に「読み込み終了」させるため、addEventListenerとuseEffectの合わせ技が必要。removeEventListenerでメモリリーク対策も必要。）
    const closeSelectFileWindow = () => {
        // デフォのファイル選択ウィンドウを閉じた直後なら、読み込み解除とclosed解除をする。
        if ( closed ) {
            setClosed(false)
            setFileLoading(false)
        }
    }
    // このuseEffectで「ファイル選択ウィンドウ」が閉じたとき、確実に処理を発火させる。
    useEffect( () => {
        window.addEventListener('focus', closeSelectFileWindow)
        return () => window.removeEventListener('focus', closeSelectFileWindow)
    })



    // --- 「読み込み終了時」の共通処理 ---
    // （useEffectの[loading,status] かつ if( !loading )で発火できる）
    useEffect( () => {
        if ( fileLoading ) return   // 読み込み中なら処理しない。
        // 状態のURLに設定する。new以外はファイルをnullにする。
        if ( status === 'none' ) { setUrl('/images/no_image.png'); setFile(null) }
        else if ( status === 'old' ) { setUrl(oldUrl); setFile(null) }
        else if ( status === 'new' ) {
            const newUrl = URL.createObjectURL(file)    // 選択ファイルのURLを取得する。
            setUrl(newUrl)
            return () => URL.revokeObjectURL(url) // 上記「ファイルのURL取得」のメモリ対策。
        }
    }, [fileLoading, status] )


    // 表示画像のjsx
    const Image = (<Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
    >
        <Stack
            justifyContent="center"
            alignItems="center"
            css={css`
                width: 128px; height: 128px;
                background: ${ palette.bg2 };
            `}
        >
            <img
                src={ url }
                css={css`
                    max-width: 100%; max-height: 100%;
                    opacity: 1;
                    ${ fileLoading && `opacity: 0;` }
                    ${ disabled && `opacity: 0.6;` }
                `}
            />
        </Stack>
        <CircularProgress color="primary" css={css`
            position: absolute;
            transition: opacity 0.25s;
            opacity: ${ fileLoading ? 1 : 0 }
        `} />
    </Stack>)


    // 「画像なしにする」ボタンのjsx
    const NoImageButton = (
        <Button variant="contained" color="secondary"
            disabled={ fileLoading || disabled }
            onClick={ buttonClicked }
            css={css` ${!ButtonHidden || `display:none;` } `}
        >{ __('no image') }</Button>
    )



    return (<div>

        {/* デフォのinput file。見た目を変えるため、cssで隠している。 */}
        <input type="file" id="input_file"
            css={css` display: none; `}
            onClick={ inputClicked }
            onChange={ fileChange }
        />

        {/* ファイル選択の見た目をここに書く。
        上記のinput file との紐付けは「inputのid」=「このlabelのhtmlFor」でする。 */}
        <fieldset
            css={css`
                border:1px ${palette.bg3} solid;
                border-radius: 4px;
                &, * {transition: opacity 0.5s;}
                ${ (undefined === errorText) || `
                    *:not(button) { color: ${palette.error.main}; }

                    border-color: ${palette.error.main}
                ` }
            `}
        >
            <legend css={css`
                margin-left: 12px;
                margin-bottom: -9px;
                padding:0 4px;
                color: ${palette.text.primary};
                opacity: 0.8;
                font-size: 0.8rem;
                z-index: 10 !important;
            `}>{ label }</legend>

            <label htmlFor="input_file"
                onDragOver={ e => e.preventDefault() }  // onDrop発火に必要。
                onDrop={ fileDrop }      // 自作dropはここに書く。
            >
                {/* tablet幅未満で表示を消す。 */}
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={3}
                    css={css`
                        padding: 16px;
                        :hover {
                            background: ${palette.bg2};
                            ${ fileLoading && `background: none;`}
                        }
                        ${ bp.down('tablet') } { display:none; }
                    `}
                >
                    { Image }
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        css={css` position: relative; `}
                    >
                        <div css={css`
                            opacity: 1;
                            ${ fileLoading && `opacity:0.6;` }
                            ${ disabled && `opacity:0.6;` }
                        `}>
                            { __('Select image file.') }<br />
                            { __('click or drag and drop.') }
                        </div>
                        {/* 「画像なしにするボタン」 */}
                        <div
                            css={css`
                                width: 150px;
                                position: absolute;
                                left: 0;
                                bottom: 0;
                            `}
                        >{ NoImageButton }</div>
                    </Stack>
                </Stack>

                {/* tablet幅未満で表示する。 */}
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    css={css`
                        padding: 16px;
                        ${bp.up('tablet')} { display:none; }
                    `}
                >
                    <div>
                        {Image}
                        <div css={css`
                            color:${ palette.text.primary };
                            ${ fileLoading &&
                            `color:${ palette.text.disabled };`
                            }
                        `}>画像を押して選択</div>
                    </div>
                    {NoImageButton}
                </Stack>
            </label>
        </fieldset>
        <div css={css`
            color: ${palette.error.main};
            font-size: 0.85rem;
        `}>{ errorText }</div>
    </div>)
}

