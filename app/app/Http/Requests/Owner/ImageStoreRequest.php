<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class ImageStoreRequest extends FormRequest
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
            'title' => ['required', 'min:2', 'max:100'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
        ];
    }

    public function messages()
    {
        return [
            'image.max' => __('File size is up to 2MB.'),
        ];
    }
}
