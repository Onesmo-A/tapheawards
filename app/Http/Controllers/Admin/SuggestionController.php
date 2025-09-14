<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Suggestion; // Hakikisha una Model ya 'Suggestion'
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class SuggestionController extends Controller
{
    /**
     * Onyesha orodha ya mapendekezo yote.
     */
    public function index(Request $request)
    {
        $suggestions = Suggestion::query()
            ->with('category') // Pakia taarifa za kategoria
            ->when($request->input('search'), function ($query, $search) {
                $query->where('suggested_nominee_name', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhere('suggester_name', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Suggestions/Index', [
            'suggestions' => $suggestions,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Futa pendekezo maalum.
     */
    public function destroy(Suggestion $suggestion)
    {
        $suggestion->delete();
        return redirect()->route('admin.suggestions.index')->with('success', 'Pendekezo limefutwa kikamilifu.');
    }

    /**
     * Export suggestions data to a PDF file.
     */
    public function exportPdf(Request $request)
    {
        $titleParts = ['Ripoti ya Mapendekezo'];

        $suggestions = Suggestion::query()
            ->with('category')
            ->when($request->input('search'), function ($query, $search) use (&$titleParts) {
                $query->where('suggested_nominee_name', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%")
                    ->orWhere('suggester_name', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                $titleParts[] = 'kwa "' . $search . '"';
            })
            ->latest()
            ->get();

        $title = count($titleParts) > 1 ? implode(' ', $titleParts) : 'Ripoti ya Mapendekezo Yote';

        $data = [
            'title' => $title,
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'suggestions' => $suggestions,
            'filters' => $request->only(['search']),
        ];

        $pdf = PDF::loadView('reports.suggestions_pdf', $data);
        return $pdf->download('suggestions-report-' . now()->format('Y-m-d') . '.pdf');
    }
}