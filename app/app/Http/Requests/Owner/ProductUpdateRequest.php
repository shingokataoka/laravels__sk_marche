<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

use App\Models\Image;

class ProductUpdateRequest extends FormRequest
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
        // ログインownerの画像でないなら弾く。
        $imageRute = function ($attribute, $value, $fail) {
            $ownerId = auth()->id();
            $image = Image::findOrFail($value);
            // dd($ownerId , $image->owner->id);
            if ( $ownerId !== $image->owner->id ) {
                $fail( __('There is an invalid image specification.') );
            }
        };

        return [
            'name' => ['required', 'string', 'between:2,255'],
            'information' => ['nullable', 'string', 'between:0,5000'],
            'price' => ['required', 'integer', 'min:0', 'max:910001000'],
            'sort_order' => ['required', 'integer', 'min:1'],
            'quantity' => ['nullable', 'integer', 'between:0,9999'],
            'secondary_category_id' => ['required','exists:secondary_categories,id'],
            'image1' => ['nullable', 'exists:images,id', $imageRute],
            'image2' => ['nullable', 'exists:images,id', $imageRute],
            'image3' => ['nullable', 'exists:images,id', $imageRute],
            'image4' => ['nullable', 'exists:images,id', $imageRute],
            'is_selling' => ['required', 'boolean'],
        ];
    }

    public function messages()
    {
        return [
            'image1.max' => __('File size is up to 2MB.'),
            'image2.max' => __('File size is up to 2MB.'),
            'image3.max' => __('File size is up to 2MB.'),
            'image4.max' => __('File size is up to 2MB.'),
        ];
    }
}
