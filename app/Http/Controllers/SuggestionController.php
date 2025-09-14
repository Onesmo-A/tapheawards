<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SuggestionController extends Controller
{
    /**
     * Hifadhi pendekezo jipya kutoka kwa mtumiaji.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'suggested_nominee_name' => [
                    'required',
                    'string',
                    'max:255',
                    // Uthibitisho wa kipekee
                    Rule::unique('suggestions')->where(function ($query) use ($request) {
                        return $query->where('category_id', $request->category_id)
                                     ->where('fingerprint_js', $request->fingerprint_js);
                    }),
                ],
                'suggested_nominee_phone' => 'nullable|string|max:20',
                'suggested_nominee_workplace' => 'nullable|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'reason' => 'required|string|min:20',
                'suggester_name' => 'nullable|string|max:255',
                'fingerprint_js' => 'required|string', // Hakikisha fingerprint inatumwa
            ], [
                'suggested_nominee_name.unique' => 'Ushampendekeza mtu huyu katika kategoria hii. Asante kwa mchango wako!',
                'category_id.required' => 'Tafadhali chagua kategoria.',
                'reason.required' => 'Tafadhali eleza sababu za kumpendekeza.',
                'reason.min' => 'Maelezo ya sababu yanapaswa kuwa na angalau herufi 20.',
            ]);

            Suggestion::create($validated);

        } catch (ValidationException $e) {
            // Ikiwa kosa ni la 'unique' validation, redirect kwenda duplicate page.
            if ($e->validator->errors()->has('suggested_nominee_name')) {
                $errorMessage = $e->validator->errors()->first('suggested_nominee_name');
                return redirect()->route('suggestion.duplicate')->with('error', $errorMessage);
            }
            // Kwa makosa mengine yote ya validation, rudisha kama kawaida.
            throw $e;
        }

        $successMessage = 'Asante! Pendekezo lako limepokelewa na litapitiwa na timu yetu.';

        // Baada ya mafanikio, mwelekeze kwenye ukurasa wa shukrani
        return redirect()->route('suggestion.thanks')
            ->with('success', $successMessage);
    }
}