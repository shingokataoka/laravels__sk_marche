<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class ShopUpdateRequest extends FormRequest
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
        return [
            'name' => ['string', 'min:2', 'max:255', 'required'],
            'information' => ['string', 'min:2', 'max:1000', 'required'],
            'is_selling' => ['boolean', 'required'],
            'file' => ['image', 'mimes:jpeg,jpg,png', 'max:1024', 'nullable'],
        ];
    }

    public function messages()
    {
        return [
            'file.max' => __('File size is up to 1MB.'),
        ];
    }
}
