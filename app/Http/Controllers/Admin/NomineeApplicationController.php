<?php

namespace App\Http\Controllers\Admin;
use App\Models\NomineeApplication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class NomineeApplicationController extends Controller
{
    /**
     * Onyesha orodha ya maombi yote.
     */
    public function index(Request $request)
    {
        $applications = NomineeApplication::query()
            ->with(['user:id,name', 'category:id,name', 'transaction', 'reviewer:id,name']) // BORESHO: Ongeza reviewer
            ->when($request->input('search'), function ($query, $search) {
                $query->where('applicant_name', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('category', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Onyesha taarifa za ombi moja.
     */
    public function show(NomineeApplication $application)
    {
        $application->load(['user', 'category', 'transaction']);
        return Inertia::render('Admin/Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Sasisha status ya ombi (Kubali/Kataa).
     */
    public function update(Request $request, NomineeApplication $application)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject',
            'rejection_reason' => 'nullable|string|required_if:action,reject',
        ]);

        try {
            if ($validated['action'] === 'approve') {
                // BORESHO: Tumia DB Transaction kuhakikisha hatua zote zinafanikiwa pamoja.
                // Hii inazuia application kuwa 'approved' kama Nominee hajaundwa.
                DB::transaction(function () use ($application) {
                    // 1. Badilisha status ya ombi
                    $application->update([
                        'status' => 'approved',
                        'reviewed_by' => auth()->id(), // Rekodi ID ya admin
                        'reviewed_at' => now(),
                    ]);

                    // 2. Andaa data za pre-fill kwa ajili ya fomu ya kuunda Nominee
                    $prefillData = [
                        'name' => $application->applicant_name,
                        'bio' => $application->bio,
                        'category_id' => $application->category_id,
                        'image_path' => $application->photo_path, // Tumia photo_path
                        'source_application_id' => $application->id, // Tuma ID ya ombi kwa ajili ya reference
                        'facebook_url' => $application->facebook_url,
                        'instagram_url' => $application->instagram_url,
                        'tiktok_url' => $application->tiktok_url,
                    ];

                    // Weka data ya prefill kwenye session ili itumike kwenye ukurasa wa 'nominees.create'
                    session()->flash('prefill', $prefillData);
                });

                return redirect()->route('admin.nominees.create');
            }

            if ($validated['action'] === 'reject') {
                $application->update([
                    'status' => 'rejected',
                    'rejection_reason' => $validated['rejection_reason'],
                    'reviewed_by' => auth()->id(), // Rekodi ID ya admin
                    'reviewed_at' => now(),
                ]);
                return redirect()->route('admin.applications.index')->with('success', 'Ombi limekataliwa kikamilifu.');
            }
        } catch (\Exception $e) {
            \Log::error('Failed to update application status: ' . $e->getMessage());
            return back()->with('error', 'Kuna kosa la kiufundi limetokea. Tafadhali jaribu tena.');
        }
        return redirect()->route('admin.applications.index')->with('error', 'Kitendo hakijulikani.');
    }

    /**
     * Export applications data to a PDF file.
     */
    public function exportPdf(Request $request)
    {
        $titleParts = ['Ripoti ya Maombi ya Ushiriki'];

        $applications = NomineeApplication::query()
            ->with(['user:id,name', 'category:id,name', 'transaction:status'])
            ->when($request->input('search'), function ($query, $search) use (&$titleParts) {
                $query->where('applicant_name', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('category', fn($q) => $q->where('name', 'like', "%{$search}%"));
                $titleParts[] = 'kwa "' . $search . '"';
            })
            ->when($request->input('status'), function ($query, $status) use (&$titleParts) {
                $query->where('status', $status);
                $titleParts[] = 'yenye status "' . str_replace('_', ' ', $status) . '"';
            })
            ->latest()
            ->get();

        $title = count($titleParts) > 1 ? implode(' ', $titleParts) : 'Ripoti ya Maombi Yote';

        $data = [
            'title' => $title,
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'applications' => $applications,
            'filters' => $request->only(['search', 'status']),
        ];

        $pdf = PDF::loadView('reports.applications_pdf', $data);
        $slug = 'applications-report-' . now()->format('Y-m-d');

        return $pdf->download($slug . '.pdf');
    }
}