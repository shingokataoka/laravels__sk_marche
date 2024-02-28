<style>
    /* 共通のcss */

    /*「読込中」と「- クレジットカード情報を入力 -」の親div */
    #loading-container {
        margin-top: 16px;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position:relative;
    }

    /* 「読込中」のcss。読み込み後に消す。 */
    #stripe-loading {
        user-select:none;
        animation:1.7s linear infinite rotation;
        transition:all 0.5s;
        opacity: 1;
    }
    body.loaded #stripe-loading {
        animation:none;
        opacity: 0;
    }

    /* 「- クレジットカード情報を入力 -」のcss。読み込み後に表示する。 */
    #stripe-loaded{
        margin-top:-1em;
        position:absolute;
        transition: all 0.5s;
        opacity:1;
    }
    body:not(.loaded) #stripe-loaded{
        opacity:0;
    }

    /* カード番号入力欄を囲むdiv。この中にstripeでiframeが挿入される。 */
    .card-container {
        border: 1px #000 solid;
        border-radius: 6px;
        padding: 16px;
        transition: all 0.5s;
        opacity: 0.3;
    }
    body.loaded .card-container{
        opacity:1;
    }

    /* ボタン系のCSS */
    /* card-buttonとも共通部分 */
    .secondary_button,
    #card-button {
        border: rgba(0,0,0,0) 1px solid;
        background:none;
        border-radius: 8px;
        padding: 12px;
        font-size: 0.9rem;
        cursor: pointer;
    }
    .secondary_button {
        min-width:100px;
    }

    #card-button {
        transition: all  0.25s;
        position: relative;
    }
    /* stripeのcardElementを読み込むまでは非表示。 */
    #card-button.not_show {
        opacity:0;
        cursor: unset;
    }

    /* ボタン内のテキストのcss */
    .not_processing { transition: opacity 0.25s; }
    /* ボタンがdisabled中なら非表示。 */
    .disabled > .not_processing { opacity:0; }

    /* ボタン内のloadingボタンを上下center表示。 */
    .processing {
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        display:flex;
        justify-content:center;
        align-items:center;
        background:inherit;
        transition: opacity 0.25s;
        opacity:1;
    }
    /* ボタンがdisabled以外なら非表示 */
    :not(.disabled) > .processing { opacity:0; }

    /* モーダルウィンドウのCSS */
    #modal_container {
        position:fixed;
        top:0;
        left:0;
        background: rgba(0,0,0,0.4);
        width: 100vw;
        height:100vh;
        text-align:center;
        display:flex;
        justify-content:center;
        align-items:center;
        transition:opacity 0.3s;
        opacity:1;
    }
    /* モーダルウィンドウを閉じるcss */
    #modal_container.closed {
        opacity:0;
    }
    #modal_content {
        border-radius: 8px;
        border:2px transparent solid;
        background: none;
        padding: 16px;
    }


    /* ライトモードのcss */
    .bg1 { background:#f5f5f5; }
    .bg2 { background:#eeeeee; }
    .bg3 { background:#e0e0e0; }
    .bg4 { background:#bdbdbd; }
    .bg5 { background:#9e9e9e; }
    .bg6 { background:#757575; }
    .bg7 { background:#616161; }
    .bg8 { background:#424242; }
    .bg9 { background:#212121; }
    hr.bg1 { border-color:#f5f5f5; }
    hr.bg2 { border-color:#eeeeee; }
    hr.bg3 { border-color:#e0e0e0; }
    hr.bg4 { border-color:#bdbdbd; }
    hr.bg5 { border-color:#9e9e9e; }
    hr.bg6 { border-color:#757575; }
    hr.bg7 { border-color:#616161; }
    hr.bg8 { border-color:#424242; }
    hr.bg9 { border-color:#212121; }

    body {
        background: #fff;
        color: #222;
    }

    /* セカンドボタンのカラー */
    body .secondary_button {
        background:none;
        border-color:#9c27b0;
        color: #9c27b0;
    }
    body .secondary_button:active {
        background:#9b27b024;
    }

    .card-container {
        border-color: rgba(0,0,0, 0.5);
        background: rgba(0,0,0, 0.1);
    }
    #card-button {
        background: rgb(2, 136, 209);
        color: #fff;
        box-shadow: 0 2px 2px 0px rgba(0,0,0, 0.5);
    }

    body #card-button.disabled {
        /* border:#757575 1px solid; */
        background:#e0e0e0;
        box-shadow: 0 2px 2px 0px rgba(0,0,0, 0);

    }

    /* モーダルウィンドウ（ライトモードでのカラー） */
    body #modal_container {}
    body #modal_content {
        border-color:#f44;
        background: #eee;
        color:#d00;
    }

    /* ダークモードのcss */
    body.dark .bg1 { background:#212121; }
    body.dark .bg2 { background:#424242; }
    body.dark .bg3 { background:#616161; }
    body.dark .bg4 { background:#757575; }
    body.dark .bg5 { background:#9e9e9e; }
    body.dark .bg6 { background:#bdbdbd; }
    body.dark .bg7 { background:#e0e0e0; }
    body.dark .bg8 { background:#eeeeee; }
    body.dark .bg9 { background:#f5f5f5; }
    body.dark hr.bg1 { border-color:#212121; }
    body.dark hr.bg2 { border-color:#424242; }
    body.dark hr.bg3 { border-color:#616161; }
    body.dark hr.bg4 { border-color:#757575; }
    body.dark hr.bg5 { border-color:#9e9e9e; }
    body.dark hr.bg6 { border-color:#bdbdbd; }
    body.dark hr.bg7 { border-color:#e0e0e0; }
    body.dark hr.bg8 { border-color:#eeeeee; }
    body.dark hr.bg9 { border-color:#f5f5f5; }

    body.dark {
        background: #000;
        color: #ddd;
    }

    /* セカンドボタンのカラー */
    body.dark .secondary_button {
        background:none;
        border-color:#ce93d8;
        color: #ce93d8;
    }
    body.dark .secondary_button:active {
        background:#ce93d82c;
    }

    body.dark .card-container {
        border-color: rgba(255,255,255,0.5);
        background: rgba(255,255,255, 0.1);
    }
    body.dark #card-button {
        background: #90caf9;
        color: #000;
    }
    body.dark #card-button.disabled {
        border:#757575 1px solid;
        background:#424242;
    }

    /* モーダルウィンドウ（ダークモードのでのカラー） */
    body.dark #modal_container {}
    body.dark #modal_content {
        border-color rgb(153, 88, 88);
        background: #333;
        color:#f77;
    }

</style>

