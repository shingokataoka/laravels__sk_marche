<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// サイト紹介ページのルーティング
Route::get('/', function () {
    return Inertia::render('Welcome');
});



require __DIR__.'/auth.php';

Route::prefix('admin')->name('admin.')->group(function() {
    require __DIR__ . '/admin.php';
});
Route::prefix('owner')->name('owner.')->group(function() {
    require __DIR__ . '/owner.php';
});
