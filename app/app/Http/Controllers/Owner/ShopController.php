<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\Owner\ShopUpdateRequest;


use Inertia\Inertia;
use App\Models\Shop;
use App\Services\ImageService;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // URL内の{shop}のownerとログインownerが違うなら404。
            $shopId = request()->route()->originalParameters()['shop'];
            $shopOwner = Shop::findOrFail($shopId)->owner;
            if ( $shopOwner->id !==  auth()->user()->id) abort(404);

            return $next($request);
        })->only(['edit', 'update']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owner = auth()->user();
        $shop = $owner->shop;
        $filename = $shop->filename;
        $imageUrl = ImageService::getShopImageUrl($filename);

        return Inertia::render('Owner/Shops/Index', compact('shop', 'imageUrl'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd(__FUNCTION__);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Shop $shop)
    {
        dd( request()->file('avatar') );
        dd(__FUNCTION__);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        dd(__FUNCTION__);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $shop = Shop::findOrFail($id);
        $oldUrl = ImageService::getShopImageUrl($shop->filename);

        return Inertia::render('Owner/Shops/Edit', compact('shop', 'oldUrl'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ShopUpdateRequest $request, Shop $shop)
    {

        // 画像を保存。statusがold new noneで分ける。
        $file = request()->file('file');
        $status = request()->status;
        if ($status === 'new') {
            $newFilename = ImageService::saveShopImage($file);
            $shop->filename = $newFilename;
        } elseif ($status === 'none') {
            ImageService::deleteShopImage($shop->filename);
            $shop->filename = null;
        }
        // DBへshop情報を保存。
        $shop->name = request()->name;
        $shop->information = request()->information;
        $shop->is_selling = request()->is_selling;
        $shop->save();

        session()->flash('status', 'success');
        session()->flash('message', __('Shop data has been updated.') );
        return to_route('owner.shops.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        dd(__FUNCTION__);
    }
}
