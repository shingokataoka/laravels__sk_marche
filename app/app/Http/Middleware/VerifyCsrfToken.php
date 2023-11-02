<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

use Symfony\Component\HttpFoundation\Cookie;
use App\Lib\Get;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];


        /**
     * Create a new "XSRF-TOKEN" cookie that contains the CSRF token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $config
     * @return \Symfony\Component\HttpFoundation\Cookie
     */
    protected function newCookie($request, $config)
    {
		// cookie自体は共有（サイトごとに一つのため）。
        // よって、'XSRF-TOKEN'は一つだけだから、ダブってしまい419になる。
		// ダブらせないために、user、admin、ownerで別名にする必要がある。

        // よって、以下3つのセッションに分ける方法にした。
		// XSRF-TOKEN = user用（つまりデフォルト）セッションとつなぐcsrf_token。
		// ADMIN-XSRF-TOKEN = admin用セッションとつなぐcsrf_token。
		// ADMIN-XSRF-TOKEN = admin用セッションとつなぐcsrf_token。

        // プレフィックスに合わせたトークン名に切り替える。
        $tokenName = 'XSRF-TOKEN';
        if (Get::guard() === 'admin') $tokenName = 'ADMIN-XSRF-TOKEN';
        if (Get::guard() === 'owner') $tokenName = 'OWNER-XSRF-TOKEN';

		// クッキーに「切り替えたトークン名=csrf_token」を作成し、セッションを生成。
        return new Cookie(
            $tokenName,
            $request->session()->token(),
            $this->availableAt(60 * $config['lifetime']),
            $config['path'],
            $config['domain'],
            $config['secure'],
            false,
            false,
            $config['same_site'] ?? null
        );
    }

}
