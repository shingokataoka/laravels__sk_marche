import { usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"
import { defaultTheme } from "./DefaultThemeProvider"
import { css, useMediaQuery } from "@mui/material"

import {Stack} from "@mui/material"
import { Button } from "@mui/material"
import {Link} from "@inertiajs/react"

import dayjs from "dayjs";
// プラグインが必要
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// tzを有効にする記述
dayjs.extend(utc);
dayjs.extend(timezone);
// ブラウザのtimezoneを予測で取得する（つまり'Asia/Tokyo'などを取得する）。
const defaultTimezone = dayjs.tz.guess()
// dayjsのデフォルトのtimezoneを設定の例。
// 未指定なら、ブラウザのtimezone（つまりJST）が使用される。
dayjs.tz.setDefault(defaultTimezone);


// モーダルウィンドウでimages一覧を作成。
// ページネーションが必要。
// つまり非同期通信でページネーションが必要。

// 親コンポーネントには以下を打ち上げる。
// 選択したimage.id（登録用）
// 選択したimage.filename（選択直後の表示用）

// 見た目はOwner/Images/Index.jsxのコピペが使える。



/** @jsxImportSource @emotion/react */
export default function SelectImage ({
    label,
    column,
    setImage,
    firstPageImages,
    imageDirUrl,
    oldFilename,
    disabled,
}) {
    const errorText = usePage().props.errors[column]
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints

    const [open, setOpen] = useState(false);

    const [filename, setFilename] = useState(oldFilename)
    const [imageUrl, setImageUrl] = useState("/images/no_image.png")

    useEffect(() => {
        if (!filename) { setImageUrl("/images/no_image.png") }
        else{ setImageUrl(imageDirUrl + filename) }
    }, [filename])

    const clickedNoImage = () => {
        setFilename(null)
        setImage(null)
    }


    return (<div>

        <TransitionsModal
            label={label}
            imageDirUrl={imageDirUrl}
            firstPageImages={firstPageImages}
            setImage={setImage}
            setFilename={setFilename}
            open={open} setOpen={setOpen}
        />

        {/* ファイル選択の見た目をここに書く。
        上記のinput file との紐付けは「inputのid」=「このlabelのhtmlFor」でする。 */}
        <fieldset
            css={css`
                border:1px ${palette.bg3} solid;
                border-radius: 4px;

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

            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={3}
                css={css`
                    padding: 16px;
                `}
            >
                {/* 選択ボタン、画像なしボタンbotann */}
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                >
                    <Button variant="outlined"
                        disabled={disabled}
                        onClick={ e => setOpen(true) }
                    >
                        { __('Select from image list') }
                    </Button>
                    <Button variant="outlined" color="secondary"
                        disabled={disabled}
                        onClick={ clickedNoImage }
                    >
                        { __('no image') }
                    </Button>
                </Stack>

                {/* 画像 */}
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    css={css`
                        width: 128px; height: 128px;
                        background: ${ palette.bg2 };
                        ${bp.down('tablet')} {
                            width: 100px; height: 100px;
                        }
                    `}
                >
                    <img
                        src={ imageUrl }
                        css={css`
                            max-width: 100%; max-height: 100%;
                        `}
                    />
                </Stack>

            </Stack>
        </fieldset>

        {/* エラー文表示 */}
        <div css={css`
            color: ${palette.error.main};
            font-size: 0.85rem;
        `}>{ errorText }</div>
    </div>)
}






import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import {Pagination} from "@mui/material"
import axios from "axios"


function TransitionsModal({
    label,
    imageDirUrl,
    firstPageImages,
    setImage,
    setFilename,
    open, setOpen,
}) {
    const _token = usePage().props._token
    const palette = defaultTheme().palette
    const bp = defaultTheme().breakpoints
    const isMobile = useMediaQuery(`(max-width:${(bp.values.tablet - 0.001)}px)`);

    const modalRef = useRef(null);
    const [images, setImages] = useState(firstPageImages)
    const [disabled, setDisabled] = useState(false)


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 102px)',
        bgcolor: 'background.paper',
        border: `2px solid ${palette.bg3}`,
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
            overflowY:'auto',
            height:'calc(100% - 70px)',
    };


    const PaginationChange = async(e, page) => {
        setDisabled(true)
        const resData = await axios.post(
            route('owner.api.products.get_images', {page:page}),
            { _token }
        ).then(res => res.data)
        setImages(resData)
        setDisabled(false)
        modalRef.current.scrollTop = 0;
    }


    const PaginationJsx = (
        <Stack spacing={2} direction="row"
            justifyContent={ isMobile? "center" : 'flex-end' }
            className="mt-[16px]"
        >
            <Pagination
                count={images.last_page}
                page={images.current_page}
                siblingCount={ isMobile? 0 : 2 }
                boundaryCount={ isMobile? 0: 2 }
                disabled={disabled}
                onChange={PaginationChange}
            />
        </Stack>
    )

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={ e => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} ref={modalRef}>

            <Stack
                direction="row"
                justifyContent={isMobile ? 'center' : 'flex-start' }
            >
                <div>{label}</div>
            </Stack>

            {PaginationJsx}

            <Stack
            direction="row"
            justifyContent={isMobile ? 'center' : 'flex-start' }
            alignItems="flex-start"
            useFlexGap={true}
            flexWrap="wrap"
            spacing={2}
            css={css` margin-top: 32px;`}
            >
                {images.data.map( image => (
                    <ImageCard key={image.id}
                        image={image}
                        imageDirUrl={imageDirUrl}
                        setImage={setImage}
                        setFilename={setFilename}
                        setOpen={setOpen}
                    />
                ) )}
            </Stack>

            {PaginationJsx}

            <Stack
                direction="row"
                justifyContent={isMobile ? 'center' : 'flex-start' }
                css={css` margin-top: 32px;`}
            >
                <Button variant="contained" color="secondary"
                    onClick={ e => setOpen(false)}
                    css={css` margin-top:16px; `}
                >{ __('Close') }</Button>
            </Stack>

          </Box>
        </Fade>
      </Modal>
    </div>
  );
}




function ImageCard ({
    image,
    imageDirUrl,
    setImage,
    setFilename,
    setOpen,
}) {
    const palette = defaultTheme().palette

    const clickedImage = (image) => {
        setImage(image.id)
        setFilename(image.filename)
        setOpen(false)
    }

    return (<button
        onClick={ e => clickedImage(image) }
        css={css`
            margin-top: 8px;
            border: 1px ${palette.bg4} solid;
            border-radius: 8px;
            width: 135px;
            min-width: 135px;
            overflow: hidden;
            font-size: 0.9rem;
            transition: all 0.2s;
            :hover{
                background: ${palette.bg2};
                opacity: 0.8;
            }
        `}
    >
        <Stack alignItems="center" >
            <img
                src={ imageDirUrl + image.filename }
                css={css`
                    max-width: 135px;
                    max-height: 135px;
                `}
            />
        </Stack>
        <div css={css` padding:8px; `}>
            <div>{ image.title }</div>
            <div>{ dayjs(image.created_at).tz().format('YYYY-MM-DD') }</div>
        </div>
    </button>);

}
