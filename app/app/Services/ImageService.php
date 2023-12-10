<?php
namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use InterventionImage;

// ショップ画像や商品画像ファイルを扱うクラス。
class ImageService
{
    // no image画像のURLを返す。
    public static function getNoImageUrl()
    {
        return '/images/no_image.png';
    }

    // ファイル名を渡すと、ショップ画像のURLパスを返す。なければno imageのURLを返す。
    public static function getShopImageUrl($filename)
    {
        if ( empty($filename) ) { $imageUrl = self::getNoImageUrl(); }
        else { $imageUrl = Storage::url("shops/images/{$filename}"); }
        return $imageUrl;
    }

    // ファイル名を渡すと、商品画像のURLパスを返す。
    public static function getProductImageUrl($filename)
    {
        return Storage::url('products/images/'. $filename);
    }

    // ショップ画像ファイルを保存する。戻り値はファイル名を返す。
    public static function saveShopImage($file)
    {
        // まず、1920 x 1080px以下に変換して取得。
        $resizeImage = self::resizeImage($file);
        // 一意の保存ファイル名を生成。
        $basename = Carbon::now()->format('YmdHis') .'_'. uniqid();
        $extension = $file->extension();
        $filename = $basename .'.'. $extension;
        // StorageのデフォDisk（publicに設定）のshops/images/直下に保存。
        Storage::put("shops/images/{$filename}", $resizeImage);
        // 保存ファイル名を返す。
        return $filename;
    }
    // 商品画像ファイルを保存する。戻り値はファイル名を返す。
    public static function saveProductImage($file)
    {
        // まず、1920 x 1080px以下に変換して取得。
        $resizeImage = self::resizeImage($file);
        // 一意の保存ファイル名を生成。
        $basename = Carbon::now()->format('YmdHis') .'_'. uniqid();
        $extension = $file->extension();
        $filename = $basename .'.'. $extension;
        // StorageのデフォDisk（publicに設定）のproducts/images/直下に保存。
        Storage::put("products/images/{$filename}", $resizeImage);
        // 保存ファイル名を返す。
        return $filename;
    }


    // ショップの画像ファイルを削除する。
    public static function deleteShopImage($filename)
    {
        Storage::Delete("shops/images/{$filename}");
    }
    // 商品の画像ファイルを削除する。
    public static function deleteProductImage($filename)
    {
        Storage::Delete("products/images/{$filename}");
    }

    // $dir内に1920 x 1080px 以下サイズにした画像を返す。
    private static function resizeImage ($file)
    {
        $resizeImage = InterventionImage::make($file)
            // 幅を以下に変換。縦横比維持。
            ->widen(1920, function ($constraint) {
                $constraint->upsize();
            })
            // 高さを以下に変換。縦横比維持。
            ->heighten(1080, function ($constraint) {
                $constraint->upsize();
            })
            ->encode();
        return $resizeImage;
    }
}
