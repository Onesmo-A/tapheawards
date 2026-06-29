<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fingerprint_js' => ['required', 'string', 'min:10', 'max:255'],
            'screen_resolution' => ['required', 'string', 'max:50'],
            'timezone' => ['required', 'string', 'max:100'],
            'language' => ['required', 'string', 'max:20'],
            'vote_session_token' => ['required', 'string', 'min:20', 'max:2048'],
            'vote_nonce' => ['required', 'string', 'min:10', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'page_time_seconds' => ['nullable', 'integer', 'min:0', 'max:86400'],
            'mouse_move_count' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'scroll_count' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'focus_count' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'blur_count' => ['nullable', 'integer', 'min:0', 'max:100000'],
        ];
    }

    public function messages(): array
    {
        return [
            'fingerprint_js.required' => 'A technical issue occurred, please try again (FP-JS).',
            'fingerprint_js.min' => 'A technical issue occurred, please try again (FP-JS-MIN).',
            'screen_resolution.required' => 'A technical issue occurred, please try again (SCR).',
            'timezone.required' => 'A technical issue occurred, please try again (TZ).',
            'language.required' => 'A technical issue occurred, please try again (LANG).',
            'vote_session_token.required' => 'A security check is required. Please reload the page and try again.',
            'vote_nonce.required' => 'A security check is required. Please reload the page and try again.',
            'website.max' => 'A technical issue occurred, please try again.',
        ];
    }
}
