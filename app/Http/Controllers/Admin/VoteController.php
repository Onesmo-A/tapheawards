<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Models\Nominee;
use App\Models\Vote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'date_from', 'date_to']);

        $votes = Vote::with(['nominee.category'])
            ->when($request->input('search'), function ($query, $search) {
                // Tafuta kura kulingana na jina la mshiriki
                $query->whereHas('nominee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            // Chuja kwa Kategoria
            ->when($request->input('category_id'), function ($query, $categoryId) {
                $query->whereHas('nominee', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
            })
            // Chuja kwa Tarehe
            ->when($request->input('date_from'), function ($query, $dateFrom) {
                $query->where('created_at', '>=', $dateFrom);
            })
            ->when($request->input('date_to'), function ($query, $dateTo) {
                $query->where('created_at', '<=', $dateTo . ' 23:59:59');
            })
            ->latest() // Panga kuanzia kura mpya zaidi
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Votes/Index', [
            'votes' => $votes,
            'filters' => $filters,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Export all votes to a PDF file.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportPdf(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'date_from', 'date_to']);
        $titleParts = ['Ripoti ya Kura'];

        // Anzisha query ya kura
        $votesQuery = Vote::with(['nominee.category'])
            ->when($request->input('search'), function ($query, $search) use (&$titleParts) {
                // Tafuta kura kulingana na jina la mshiriki
                $query->whereHas('nominee', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
                $titleParts[] = 'kwa Mshiriki "' . $search . '"';
            })
            ->when($request->input('category_id'), function ($query, $categoryId) use (&$titleParts) {
                $query->whereHas('nominee', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
                $category = Category::find($categoryId);
                if ($category) {
                    $titleParts[] = 'katika Kategoria "' . $category->name . '"';
                }
            })
            ->when($request->input('date_from'), function ($query, $dateFrom) use (&$titleParts) {
                $query->where('created_at', '>=', $dateFrom);
                $titleParts[] = 'kuanzia ' . \Carbon\Carbon::parse($dateFrom)->format('d M Y');
            })
            ->when($request->input('date_to'), function ($query, $dateTo) use (&$titleParts) {
                $query->where('created_at', '<=', $dateTo . ' 23:59:59');
                $titleParts[] = 'hadi ' . \Carbon\Carbon::parse($dateTo)->format('d M Y');
            });

        $votes = $votesQuery->latest()->get();

        $data = [
            'title' => count($titleParts) > 1 ? implode(' ', $titleParts) : 'Ripoti ya Kura Zote', // BORESHO: Kichwa cha habari kinachoeleweka zaidi
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'votes' => $votes,
        ];

        // Tengeneza PDF kwa kutumia view maalum
        $pdf = PDF::loadView('reports.votes_pdf', $data);

        return $pdf->download('ripoti-ya-kura.pdf');
    }

    /**
     * Reset all votes in the system.
     * This will delete all vote records and reset the vote counts on nominees.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reset(): RedirectResponse
    {
        try {
            DB::transaction(function () {
                // 1. Futa rekodi zote kwenye jedwali la 'votes'.
                // Kutumia truncate ni haraka zaidi na inarudisha 'auto-incrementing IDs' mwanzo.
                Vote::truncate();

                // 2. Weka 'votes_count' kuwa 0 kwa washiriki wote.
                Nominee::query()->update(['votes_count' => 0]);
            });
        } catch (\Throwable $e) {
            Log::error('Failed to reset votes: ' . $e->getMessage());

            return redirect()->route('admin.dashboard')
                ->with('error', 'Kuna kosa limetokea wakati wa kureset kura. Tafadhali angalia logs.');
        }

        return redirect()->route('admin.dashboard')
            ->with('success', 'Kura zote zimefutwa na kuwekwa upya kikamilifu.');
    }
}