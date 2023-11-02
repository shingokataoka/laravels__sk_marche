<?php

namespace App\Lib;

class Get
{
    public static function guard()
    {
        // request()->is()がProviderでも使えたから、これでいく。
				// （request()->routeIs()などは、Providerでは使えない。）
        if( request()->is('admin') or request()->is('admin/*') ) return 'admin';
        if( request()->is('owner') or request()->is('owner/*') ) return 'owner';
        return 'web';
    }

    public static function namePrefix()
    {
        if( request()->is('admin') or request()->is('admin/*') ) return 'admin.';
        if( request()->is('owner') or request()->is('owner/*') ) return 'owner.';
        return '';
    }

    public static function prefix()
    {
        if( request()->is('admin') or request()->is('admin/*') ) return 'admin';
        if( request()->is('owner') or request()->is('owner/*') ) return 'owner';
        return '';
    }
}
