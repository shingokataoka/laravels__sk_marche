<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// オーバーライドしたリセットリンクの内容のを 別名で use する
use App\Vendor\Illuminate\Auth\Notifications\OwnerResetPassword as ResetPasswordNotification;

use Illuminate\Database\Eloquent\SoftDeletes;


class Owner extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // リセットリンクを送るメソッドをオーバーライドして、
    // 作ったリセットリンクので送信に設定
    public function sendPasswordResetNotification($token){
        $this->notify(new ResetPasswordNotification($token));
    }

    public function shop ()
    {
        return $this->hasOne(Shop::class);
    }

    public function Images()
    {
        return $this->hasMany(Image::class);
    }
}
