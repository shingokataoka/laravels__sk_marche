<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

use App\Lib\Get;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        // $guards = empty($guards) ? [null] : $guards;

        $homes = [
            'admin' => routeServiceProvider::ADMIN_HOME,
            'owner' => routeServiceProvider::OWNER_HOME,
            'web' => routeServiceProvider::HOME,
        ];

        $guard = Get::guard();
        $home = $homes[$guard];

        if (Auth::guard($guard)->check()) {
            return redirect($home);
        }


        return $next($request);
    }
}
