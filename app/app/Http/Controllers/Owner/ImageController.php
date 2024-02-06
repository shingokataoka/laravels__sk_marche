<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Services\ImageService;
use App\Models\Image;
use App\Models\Product;
use App\Http\Requests\Owner\ImageStoreRequest;
use App\Http\Requests\Owner\ImageUpdateRequest;

class ImageController extends Controller
{

    public function __construct()
    {
        // URIの{shop}がログインownerのでないなら、404を表示する。
        $this->middleware(function ($request, $next) {
            $imageId = $request->route()->originalparameters()['image'];
            $image = Image::findOrFail($imageId);
            $owner = auth()->user();
            if ($image->owner_id !== $owner->id) abort(404);
            return $next($request);
        })->only(['edit', 'update', 'destroy']);
    }

    // 特定idのimageが何ページかを返す。
    protected function getIdToPage($id)
    {
        // id以上の数を取得
        $count = Image::where('id', '>=', $id)->count();
        // 数/ページ数を切り上げでいける。
        $page = (int)ceil($count / 15);
        return $page;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owner = auth()->user();
        $images = Image::where('owner_id',$owner->id)->orderBy('id', 'desc')->paginate(15);
        $imageDirUrl = ImageService::getProductImageUrl('');
        return Inertia::render('Owner/Images/Index', compact('images', 'imageDirUrl'));
        dd($images);
        dd(__FUNCTION__);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owner/Images/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ImageStoreRequest $request)
    {
        $file = request()->file('image');
        $filename = ImageService::saveProductImage($file);
        $ownerId = auth()->id();
        Image::create([
            'owner_id' => $ownerId,
            'filename' => $filename,
            'title' => $request->title,
        ]);
        session()->flash('status', 'success');
        session()->flash('message', __('Added an image.'));

        return to_route('owner.images.index');
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
    public function edit(Image $image)
    {
        // 戻るボタン用に取得しておく。
        $page = $this->getIdToPage($image->id);
        $oldImageUrl = ImageService::getProductImageUrl($image->filename);
        return Inertia::render('Owner/Images/Edit', compact('image', 'oldImageUrl', 'page'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ImageUpdateRequest $request, Image $image)
    {
        if ($request->status === 'new') {
            ImageService::deleteProductImage( $image->filename );
            $file = $request->file('image');
            $filename = ImageService::saveProductImage($file);
            $image->filename = $filename;
        }
        $image->title = $request->title;
        $image->save();
        session()->flash('status', 'success');
        session()->flash('message', __('Image data has been updated.'));

        $page = $this->getIdToPage($image->id);
        return to_route('owner.images.index', compact('page'));
        dd(__FUNCTION__);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        // 親商品があるなら、「削除できない」趣旨表示する処理。
        if ($image->countProducts() ) {
            session()->flash('status', 'warning');
            session()->flash('message', __("There is product data that uses this image.\r\nTherefore, it cannot be deleted.") );
            return to_route('owner.images.edit', $image->id);
        }

        // imagesレコードを削除する前に画像ファイルも削除する。
        ImageService::deleteProductImage($image->filename);

        // 削除後のリダイレクト先ページを取得しておく。
        $page = $this->getIdToPage($image->id);
        // 「タイトル」を削除しました。で使うタイトルを取得。
        $title = $image->title;
        // imagesテーブルからレコードを削除する。
        $image->delete();
        // 「〇〇を削除しました。」のフラッシュをerrorでセット（削除なので赤く表示するため）。
        session()->flash('status', 'error');
        session()->flash( 'message', __("Image \":title\" has been deleted.", ['title' => $title]) );

        return to_route('owner.images.index', compact('page'));
    }
}
