<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Image;

class ApiProductController extends Controller
{
    public function getImages()
    {
        $ownerId = auth()->id();
        $images = Image::where('owner_id', $ownerId)->orderByDesc('id')->paginate(15);
        return $images;
    }
}
