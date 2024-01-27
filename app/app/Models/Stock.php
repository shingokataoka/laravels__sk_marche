<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 't_stocks';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // --- ミューテタ ---
    // typeに合わせて、quantityの+か-かを修正して保存・更新する。
    public function setQuantityAttribute($value)
    {
        $value = (int)$value;
        $value = (int)sqrt( pow($value, 2) );
        $type = (int)$this->attributes['type'];
        if ( (int)\Constant::PRODUCT_ADD === $type ) { $value = $value; }
        elseif ( (int)\Constant::PRODUCT_REDUCE === $type ) { $value = $value * -1; }
        elseif ( (int)\Constant::PRODUCT_CANCEL === $type ) { $value = $value; }
        $this->attributes['quantity'] = $value;
    }
}
