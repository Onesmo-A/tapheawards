<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // We assume only authenticated admins can access this.
        // The route middleware will handle the 'admin' role check.
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
            'type' => ['required', 'string', 'in:image,youtube,instagram'],
            'content' => ['required', 'string'],
            // If you handle image uploads, you might change the rule for 'content'
            // when type is 'image' to something like:
            // 'content' => ['required_if:type,youtube,instagram', 'nullable', 'string'],
            // 'image_file' => ['required_if:type,image', 'nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }
}