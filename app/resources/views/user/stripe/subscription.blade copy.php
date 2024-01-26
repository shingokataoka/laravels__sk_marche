<x-app>
    <x-slot name="title">サブスクテスト - {{ config('app.name') }}</x-slot>

    <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        {{ __('Subscription') }}
    </h2>

    {{-- CSSコード含むstyleタグを読み込み --}}
    @include('user.stripe.styles')



    <form id="setup-form" action="{{ route('user.stripe.subscribe.post') }}" method="post">
        @csrf
        <div>stripeテスト用のクレジットカード番号。コピペ用。テストが終われば削除</div>
        <div>テスト用カード番号<input value="4242424242424242"></div>
        <div>不正解カード番号<input value="4242324242424242"></div>

        {{-- Stripeのjsコードにより、クレジットカード入力欄になる。 --}}
        <div id="card-element">ロード中</div>

        <button id="card-button">
            サブスクリプション
        </button>

    </form>



{{-- Stripeで必要 --}}
<script src="https://js.stripe.com/v3/"></script>

<script>
// stripeによるカード入力欄のstyle系オブジェクトを読み込み。
@include('user.stripe.js_styles')

const isDarkmode = window.matchMedia('(prefers-color-scheme: dark)').matches

// bodyタグに、ダークモードならclass="dark"を付ける。
const bodyDOM = document.querySelector('body')
if (isDarkmode) bodyDOM.classList.add('dark')
// stripeのカード入力欄を囲むdivタグに、ダークモードならclass="dark"を加える。
const cardElementDOM = document.getElementById('card-element')
if (isDarkmode) cardElementDOM.classList.add('dark')

// cardElement（stripeのカード入力欄）のstyleをダークモードかに合わせて取得。
const cartElementStyle =(isDarkmode)? darkStyle : lightStyle


    // ルーティングからcompactで直で受け取った。
    // $intent(SeuptIntentsオブジェクト)内にあるSETUP_INTENET_CLIENT_SECRETを取得。
    const clientSecret = "{{ $intent->client_secret }}";

    const stripe = Stripe( "{{ config('stripe.public_key') }}" );

    const elements = stripe.elements();

    // stripeのカード入力系のオブジェクトを作成。
    const cardElement = elements.create('card', {
        // クレジットカード入力欄のcss。
        style: cartElementStyle,
    });
    // カード系オブジェクトにより、<div id="card-element"></div>タグにマウントする。
    // つまり、<div id="card-element"></div>タグをクレジットカード入力欄にする。
    cardElement.mount('#card-element');

    const cardHolderName = document.getElementById('card-holder-name');
    const cardButton = document.getElementById('card-button');


    // ボタンクリック時の処理。
    cardButton.addEventListener('click', async (e) => {
        e.preventDefault();
        // カード情報をStripeに送信
        const { setupIntent, error } = await stripe.confirmCardSetup(
            clientSecret,   // SETUP_INTENET_CLIENT_SECRETを渡している。
            {
                payment_method: {
                    card: cardElement,
                    // billing_details: {
                    //     ここに、stripe用のオプションを渡すらしい。
                    //     name: cardHolderName.value
                    // }
                }
            }
        );

        if (error) {
            // カード認証がエラー時の処理。エラー内容を表示しよう。
            console.log(error.message);
        } else {
            // カードが正常に認証された処理。
            // formに必要な値paymentMethodIdを追加して、サブスク決済完了処理へPOST送信。

            const form = document.getElementById('setup-form');

            const hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'paymentMethodId');
            hiddenInput.setAttribute('value', setupIntent.payment_method);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();


        }
    });

</script>

</x-app>

