<?php

use App\Http\Controllers\Owner\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Owner\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Owner\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Owner\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Owner\Auth\NewPasswordController;
use App\Http\Controllers\Owner\Auth\PasswordController;
use App\Http\Controllers\Owner\Auth\PasswordResetLinkController;
use App\Http\Controllers\Owner\Auth\RegisteredUserController;
use App\Http\Controllers\Owner\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\Owner\ProfileController;

use App\Http\Controllers\Owner\ShopController;
use App\Http\Controllers\Owner\ImageController;
use App\Http\Controllers\Owner\ProductController;
use App\Http\Controllers\Owner\ApiProductController;
use App\Http\Controllers\Owner\ExpiredProductController;


Route::middleware('auth:owner')->group(function() {

    // owner/shop/系ルーティング
    Route::resource('shops', ShopController::class)
        ->only(['index', 'edit']);
    // postしかファイルのアップロードできないから、'update'のルーティングは自作。
    Route::post('shops/{shop}/update', [ShopController::class, 'update'])
        ->where(['shop' => '^[0-9]+$'])
        ->name('shops.update');

    // owner/image/系ルーティング
    Route::resource('images', ImageController::class)
        ->except(['show', 'update']);
    Route::post('images/{image}/update', [ImageController::class, 'update'])
        ->where('image', '^[0-9]+$')
        ->name('images.update');

    // owner/products/系ルーテイング
    Route::resource('products', ProductController::class)
        ->except(['show', 'update']);
    // owner/products/updateは画像更新もあるから、postで自作。
    Route::post('products/{product}/update', [ProductController::class, 'update'])
        ->where(['product' => '^[0-9]+$'])
        ->name('products.update');

    // apiでimagesをpaginateで返す。
    Route::post('api/products/get_images', [ApiProductController::class, 'getImages'])
        ->name('api.products.get_images');

    // owner/expired/系ルーティング（削除した商品一覧系）。
    Route::resource('expired-products', ExpiredProductController::class)
        ->only(['index', 'show', 'update',]);

});



// --- 以下、ownerの認証関連 ---
Route::get('/dashboard', function () {
    return Inertia::render('Owner/Dashboard');
})->middleware(['auth:owner', 'verified'])->name('dashboard');

Route::middleware('auth:owner')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware('guest:owner')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
                ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
                ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
                ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
                ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
                ->name('password.store');
});

Route::middleware('auth:owner')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
                ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
                ->middleware(['signed', 'throttle:6,1'])
                ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
                ->middleware('throttle:6,1')
                ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
                ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
                ->name('logout');
});
