
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
    // fieldsetタグのlegendタグのラベル文字、「画像その１」など。
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

    // 表示する画像のURL。
    const [showUrl, showSetUrl] = useState(oldUrl)

    // ボタン押し時やドロップ時の読み込み遅延時間。
    const delayTime = 400


    // ---「画像なしにする」ボタン押した時の処理 ---
    // 状態='none'にする。
    const buttonClicked = e => {
        // 元の状態が'none'以外なら、読み込み中にする。
        if (status !== 'none') setFileLoading(true)
        // 状態を画像なしにする。
        setStatus('none')
        // 画像なしにする。
        setFile(null)
    }

    // 動作確認用のuseEffect。ステートが変更されればちゃんと確認できる。
    // useEffect(() => {
    //     console.log('showUrl', showUrl)
    //     console.log('status', status)
    //     console.log('file', file)
    //     console.log('fileLoading', fileLoading)
    //     console.log('ーーーーーーーー')
    // }, )


    // --- ドロップ時の処理 ---
    // 状態='new'、ファイルを変更をする。
    const fileDrop = e => {
        e.preventDefault() // 別タブでファイルが開くのを防ぐ。
        e.stopPropagation() // 親要素へのイベント伝播を防ぐ。
        if ( disabled ) return    // 親が送信中なら処理しない。
        if ( fileLoading ) return  // 読み込み中なら処理しない。
        // ファイルを取得する。
        const newFile = e.dataTransfer.items[0].getAsFile()
        // 画像でないなら処理しない。
        if ( newFile.type.indexOf('image/') !== 0 ) return

        // 読み込み中にする。
        setFileLoading(true)

        setFile( newFile )  // ステートにファイルを入れる。
        setStatus('new')    // 状態を新規ファイルにする。
    }





    // --- デフォのファイル変更時の処理 ---
    // 状態='new'、ファイルを変更する。
    const fileChange = e => {
        const newFile = e.target.files[0]

        // - 画像じゃないなら処理しない。（状態='old'のままになる。）
        if ( newFile.type.indexOf('image/') !== 0 ) return

        // 読み込み中にする。
        setFileLoading(true)

        setFile(newFile)    // - ファイルを変更する。
        setStatus('new')    // - 変更区別の値を’new'にする。
        // - input file のvalueを’’にする。次回同じファイルを選択した場合でも発火させるため。
        e.target.value = ''
    }





    // --- 画像ファイルが変更された時の処理 ---
    useEffect(() => {
        // 状態のURLに設定する。new以外はファイルをnullにする。
        if ( status === 'none' ) { showSetUrl('/images/no_image.png'); setFile(null) }
        else if ( status === 'old' ) { showSetUrl(oldUrl); setFile(null) }
        else if ( status === 'new' ) {
            const newUrl = URL.createObjectURL(file)    // 選択ファイルのURLを取得する。
            showSetUrl(newUrl)
            return () => URL.revokeObjectURL(showUrl) // 上記「ファイルのURL取得」のメモリ対策。
        }
    }, [file, status])



    // --- 「読み込み中」が変更された時の処理 ---
    useEffect( () => {}, [fileLoading] )
        // 読み込み中なら、読み込み解除を、遅延で行う。（見た目のため）
        if (fileLoading) {
            setTimeout(() => { setFileLoading(false) }, delayTime)
        }





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
                src={ showUrl }
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
            disabled={ fileLoading || disabled }
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

