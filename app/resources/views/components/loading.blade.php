<!-- 使う必須条件 -->
<!-- この自作loadingタグの配置先である親タグには、透過性のない背景色の指定が必要。 -->

<style>
@keyframes loading_transparent {
    0% { height:2px; }
    50% { height:16px; }
    100% { height:2px; }
}
@keyframes loading_spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }

}
/* ローディングの一番大枠。これでサイズを決めている。 */
/* @keyframesのloading_spinで、これごと回転させている。 */
.loading {
    margin:0;
    padding:0;
    position:relative;
    width:16px;
    height:16px;
    background:inherit;
    animation: 0.75s linear 1s infinite loading_spin;
}
/* borderを右以外に付けて丸めたもの。見た目「C」を担当している。 */
.loading_bg_border {
    box-sizing:border-box;
    margin:0;
    width:16px;
    height:16px;
    border-radius: 50%;
    border: 2px rgba(0,0,0,0.2) solid;
    border-top:none;
}
.dark .loading_bg_border {
    border-color: rgba(255,255,255,0.25);
}
/* 上記の見た目「C」を背景色で隠すのを担当している。 */
/* @keyframesのloading_transparentで幅を変化させ、見え隠しをしている。 */
.loading_bg_transparent {
    position:absolute;
    top:0; right:0;
    width:16px;
    height:16px;
    background:inherit;
    animation: 1.5s linear 1s infinite loading_transparent;
}
</style>

<!-- 一番の大枠 -->
<div class="loading">
    <!-- 見た目「C」を担当 -->
    <div class="loading_bg_border"></div>
    <!-- 上記見た目「C」を見え隠しする担当。 -->
    <div class="loading_bg_transparent"></div>
</div>
