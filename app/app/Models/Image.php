<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Casts\Attribute;


class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'filename',
        'title',
    ];


    public function owner()
    {
        return $this->belongsTo(Owner::class);
    }



    // このimageを持つproductの数を返す。
    public function countProducts()
    {
        return Product::where('image1', $this->id)
            ->orWhere('image2', $this->id)
            ->orWhere('image3', $this->id)
            ->orWhere('image4', $this->id)
            ->count();
    }
}
