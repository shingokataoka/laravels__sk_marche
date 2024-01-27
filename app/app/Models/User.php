<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// オーバーライドしたリセットリンクの内容のを 別名で use する
use App\Vendor\Illuminate\Auth\Notifications\UserResetPassword as ResetPasswordNotification;

// Cashier関係。
use Laravel\Cashier\Billable;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Billable;

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




    public function products()
    {
        return $this->belongsToMany(Product::class, 'carts')
            ->withPivot('id', 'quantity');
    }
}
