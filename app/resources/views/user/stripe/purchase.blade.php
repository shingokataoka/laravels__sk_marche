{{-- 商品画像のコンポーネントっぽい関数 --}}
@php function image_tag($product) { @endphp
    <div>
        <img src="{{ $product->image1_url }}"
            style="object-fit:scale-down; aspect-ratio:5/3; width:100%;"
        />
    </div>
@php } @endphp

{{-- 商品の 単価と数量 のコンポーネントっぽい関数 --}}
@php function amont_quantity_tag($product) { @endphp
    <div>
        <div style="display:inline-block;">
            <span style="font-size:0.8rem" >{{ __('Unit price') }} </span>
            {{ number_format($product->price) }}
            <span style="font-size:0.75rem" >{{ __('JPY (tax included)') }}</span>
        </div>
        <div style="display:inline-block; margin-left:8px;">
            {{ $product->pivot->quantity }} {{ __('') }}
        </div>
    </div>
@php } @endphp

{{-- 商品の小計のコンポーネントっぽい関数 --}}
@php function price_tag($product) { @endphp
    <div>
        {{ number_format($product->price * $product->pivot->quantity) }}
        <span style="font-size:0.75rem">{{ __('JPY (tax included)') }}</span>
    </div>
@php } @endphp















<x-app>
<x-slot name="title">{{ __('Checkout') }} - {{ config('app.name') }}</x-slot>

{{-- CSSコード含むstyleタグを読み込み --}}
@include('user.stripe.styles')
<style>
    /* スマホ幅でのcss */
    header { flex-direction:column; }
    /* タブレット幅以上でのcss */
    @media screen and (min-width: 640px){
        header { flex-direction: row; }
    }
</style>

 <header
    class="font-semibold text-xl leading-tight bg1"
    style="
        display:flex;
        align-items:center;
        gap:16px;
        padding:16px;
        padding-left:32px;
    "
 >
    <a href="{{ route('user.products.index') }}">
        <img src="/logo.png" style="max-width: 150px;" />
    </a>

    <h2
        style="font-size:1.3rem; margin-top:-6px;"
    >
        {{ __('Checkout') }}
    </h2>
 </header>


<style>
    #main_container { margin:48px 0; }
    @media screen and (min-width:640px) {
       #main_container { margin:48px 32px; }
    }
</style>
<div
    id="main_container"
    class="bg1"
    style="padding:16px; border-radius:8px;"
>

        {{-- スマホ幅で表示の 購入商品の情報 --}}
        <style>
            #mobile_show { display:block; }
            @media screen and (min-width:640px) {
               #mobile_show { display:none; }
            }
        </style>

        <div id="mobile_show">
        @foreach ($user->products as $product)
            <div
                style="
                    margin:16px;
                    display:flex;
                    flex-direction:column;
                    justify-content:flex-start;
                    align-items:center;
                    gap:16px;
                "
            >
                {{ image_tag($product) }}
                <div
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}

                >
                 <div>{{ $product->name }}</div>
                </div>

                {{ amont_quantity_tag($product) }}
                {{ price_tag($product) }}
            </div>
            <hr class="bg3" />
        @endforeach
        </div>





    {{-- タブレット幅かそれ以上で表示の 購入商品の情報 --}}
    <style>
        #tablet_show { display:none; }
        @media screen and (min-width:640px) {
            #tablet_show { display:block; }
        }
        #pc_flex > div:nth-of-type(1) { flex:0.3; }
        #pc_flex > div:nth-of-type(2) { flex:0.1; }
        #pc_flex > div:nth-of-type(3) { flex:0.3; }
        #pc_flex > div:nth-of-type(4) { flex:0.3; }
    </style>
    <div id="tablet_show">
    @foreach ($user->products as $product)
        <div id="pc_flex"
            style="
                margin:16px;
                display: flex;
                flex-direction:row;
                justify-content:flex-start;
                align-items:center;
                gap:2;
                max-width: 100%;
            "
        >
            {{ image_tag($product) }}
            <div>{{ $product->name }}</div>
            {{ amont_quantity_tag($product) }}
            {{ price_tag($product) }}
        </div>
        <hr class="bg3" />
    @endforeach
    </div>





    {{-- 送料があれば（サブスクでないなら）表示する。 --}}
    @if ( $postage !== null )
    <div style="padding:16px 0 ; text-align:center; font-size:1rem;">
        {{ $postage->name }}　
        {{ number_format($postage->price) }}
        <span style="font-size:0.75rem">{{ __('JPY (tax included)') }}</span>
        <div style="font-size:0.8rem;">
            （{{ __('Free shipping for premium members!') }}）
        </div>
    </div>
    <hr class="bg3" />
    @endif





    {{-- 合計金額 --}}
    <div
        style="
        margin-top: 32px;
        margin-bottom: 8px;
        text-align:center;
        font-size: 1.5rem;
      "
    >{{ __('Total price') }}</div>
    <div style="text-align:center; font-size:1.5rem; ">
        {{ number_format($totalPrice) }}
        <span style="font-size:1rem">
            {{ __('JPY (tax included)') }}
        </span>
    </div>





    {{-- クレジットカード情報入力欄の表示 --}}
    <style>
        /* 読み込み中のアニメーション */
        @keyframes rotation{
            0%{ opacity:0.2; }
            50%{ opacity:0.7; }
            100%{ opacity:0.2; }
        }
    </style>

    <form id="setup-form" action="{{ route('user.purchase.create') }}" method="post"
        style="margin-top:32px;"
    >
        @csrf

        <div style="text-align:center; padding-bottom:24px;">{!! nl2br('決済システムは<span style="text-decoration:underline;">テスト動作</span>です。
        よって、ここで会計しても<span style="text-decoration:underline;">実際の決済・支払いはいっさい発生しません</span>。
        この画面下部「テスト用カード番号」を入力して、安心してお試しください。') !!}</div>

        {{-- 「読込中」か「-クレジットカード入力欄- 」の表示 --}}
        <div id="loading-container">
            <div id="stripe-loading" style="

            ">
                {{ __('Loading') }}...
            </div><br />
            <div id="stripe-loaded">
                {{ __('- Enter credit card information -') }}
            </div>
        </div>

        {{-- ---以下3つはStripeのjsコードにより、クレジットカード関係の入力欄になる。--- --}}
        <div style="
            display:flex;
            flex-direction: column;
            gap: 16px;
            margin: 0 auto;
            width: 230px;
            max-width:calc(100% - 16px);
        ">
            {{-- クレジットカード「番号」の入力欄になる。 --}}
            <div class="card-container" id="card-number"></div>
            {{-- クレジットカードの「有効期限」の入力欄になる。 --}}
            <div class="card-container" id="card-expiry"></div>
            {{-- クレジットカードの「セキュリティコード」の入力欄になる。 --}}
            <div class="card-container" id="card-cvc"></div>
        </div>

        {{-- 上記クレジットカード系入力欄のエラーがあれば表示。 --}}
        <div id="card_error" style="
            padding: 16px;
            color:red;
            text-align:center;
            transition: opacity 0.2s;
            opacity:0;
        ">　</div>

        {{-- 「注文を確定する」送信ボタン。 --}}
        <div style="
            text-align:center;
            margin:16px 0;
        ">
            <button id="card-button" class="not_show">
                <span class="not_processing">{{ __('Place your order') }}</span>
                <div class="processing"><x-loading /></div>
            </button>
        </div>

    </form>



</div>



<div>stripeテスト用のクレジットカード番号。コピペ用。</div>
<div>テスト用カード番号<input value="4242424242424242"></div>
<div style="margin-bottom:64px;">不正解カード番号<input value="4242324242424242"></div>






{{-- Stripeで必要 --}}
<script src="https://js.stripe.com/v3/"></script>
<script>
// stripeによるカード入力欄のstyle系オブジェクトを読み込み。
@include('user.stripe.js_styles')

const cardButton = document.getElementById('card-button');
const card_errorDOM = document.getElementById('card_error');

// 送信中ならtrue。だが最初は、cartElementを読み込むまでfalseにしておく。
let processing = true


const isDarkmode = window.matchMedia('(prefers-color-scheme: dark)').matches
// bodyタグに、ダークモードならclass="dark"を付ける。
const bodyDOM = document.querySelector('body')
if (isDarkmode) bodyDOM.classList.add('dark')
// cardNumber（stripeのカード入力欄）のstyleをダークモードかに合わせて取得。
const cartElementStyle =(isDarkmode)? darkStyle : lightStyle

const stripe = Stripe( "{{ config('stripe.public_key') }}" );

const elements = stripe.elements();


// クレジットカード「番号」入力のオブジェクトを作成。
var cardNumberElement = elements.create('cardNumber', {style:cartElementStyle});
// クレジットカード「番号」入力欄を生成、div#card-numberにマウント(上書き)で生成。
cardNumberElement.mount('#card-number');

// 「有効期限」入力のオブジェクトを作成。
var cardExpiryElement = elements.create('cardExpiry', {style:cartElementStyle});
// 「有効期限」入力欄を生成、div#card-expiryにマウント(上書き)で生成。
cardExpiryElement.mount('#card-expiry');

// 「セキュリティコード」入力のオブジェクトを作成。
var cardCvcElement = elements.create('cardCvc', {style:cartElementStyle});
// 「セキュリティコード」入力欄を生成、div#card-cvcにマウント(上書き)で生成。
cardCvcElement.mount('#card-cvc');


// stripeのcardNumberが読み込み完了したら、ボタンを有効にして表示する。
// 「iframeが読み込み完了したら処理」で実現している。
document.addEventListener('DOMContentLoaded', event => {
     // HTMLのDOMツリーが読み込み完了した時に実行される
    document.querySelector('#card-number iframe').onload = () => {
        // iframe要素が読み込まれた時に実行される。

        // ボタンを、無効を消して、表示する。
        processing = false
        cardButton.classList.remove('not_show')

        // 「読込中」が消えたり、入力欄のopacityが1になったりする。
        document.querySelector('body').classList.add('loaded');
    };
});





// ボタンクリック時の処理。
cardButton.addEventListener('click', async (e) => {
    e.preventDefault();
    // 送信中なら処理しない（二重クリック防止）。
    if ( processing ) return

    // 送信中にする。
    processing = true
    // ボタンの見た目をdisabledにする。
    cardButton.classList.add('disabled')
    // エラーを一旦非表示にする。
    card_errorDOM.textContent = '　'
    card_errorDOM.style.opacity = 0


    // カード情報をStripeに送信
    // 「automatic_payment_methods[enabled]」を「true」に、「automatic_payment_methods[allow_redirects]」を「never」
    const { paymentMethod, error } = await stripe.createPaymentMethod(
        'card', cardNumberElement, {
            // billing_details: {
            //     name: cardHolderName.value,
            // }
        }
    );

    if (error) {
        // Display "error.message" to the user...
        setTimeout(() => {
            // エラーがあれば表示
            if (error.message !== undefined) {
                card_errorDOM.textContent = error.message
                card_errorDOM.style.opacity = 1
            }
            // 処理が終われば、送信中をfalseにする。
            processing = false
            // ボタンの見た目をdisabledなしにする。
            cardButton.classList.remove('disabled')
        }, 200)
    } else {
        // The card has been verified successfully...
        const form = document.getElementById('setup-form');

        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'paymentMethodId');
        hiddenInput.setAttribute('value', paymentMethod.id);
        form.appendChild(hiddenInput);

        // Submit the form
        form.submit();
    }

});

</script>

</x-app>

