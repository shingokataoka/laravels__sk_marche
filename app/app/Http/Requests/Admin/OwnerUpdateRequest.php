<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class OwnerUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $ownerId = request()->owner;

        return [
            'name' => ['required', 'string', 'min:2', 'max:50'],
            'email' => ['required', 'email', 'max:255', "unique:owners,email,{$ownerId}"],
            'password' => ['required', 'string', 'confirmed', 'max:100',
                // 使える文字の制限は正規表現でする。
                // （Passwordクラスではできないから）。
                'regex:/^[0-9a-zA-Z]+$/',
                // --- 以下Passwordクラスの全メソッド。->でつなげて書ける。
                // 最低８文字必要
                Password::min(8)
                // 最低１文字の文字が必要
                ->letters()
                // 最低大文字小文字が１文字ずつ必要
                // ->mixedCase()
                // 最低一文字の数字が必要
                ->numbers()
                // 最低一文字の記号が必要
                // ->symbols()
                // パスワードリストに登録されているか確認
                ->uncompromised(),
            ],
        ];
    }

    public function messages()
    {
        return [
            'password.regex' => 'パスワードは半角英数字のみ使用してください。',
            'password.password.letters' => ':attributeは、awd少なくとも1つの半角英字が含まれていなければなりません。',
        ];
    }

}
