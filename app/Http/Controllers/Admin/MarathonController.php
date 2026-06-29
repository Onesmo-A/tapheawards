<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\MarathonRegistrationsExport; // BORESHO: Ongeza kwa ajili ya Excel
use App\Models\MarathonRegistration;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf; // BORESHO: Ongeza kwa ajili ya PDF
use Maatwebsite\Excel\Facades\Excel; // BORESHO: Ongeza kwa ajili ya Excel
use Inertia\Inertia;

class MarathonController extends Controller
{
    public function index(Request $request)
    {
        $registrations = MarathonRegistration::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('unique_code', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Marathon/Index', [
            'registrations' => $registrations,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => MarathonRegistration::query()->count(),
                // REKEBISHO: Tumia string za status badala ya constants ambazo hazipo
                'completed' => MarathonRegistration::query()->where('status', 'completed')->count(),
                'pending' => MarathonRegistration::query()->where('status', 'pending_payment')->count(),
                'failed' => MarathonRegistration::query()->where('status', 'payment_failed')->count(),
            ]
        ]);
    }

    /**
     * BORESHO: Onyesha maelezo ya mshiriki mmoja.
     */
    public function show(MarathonRegistration $registration)
    {
        // Pakia taarifa za muamala zinazohusiana na usajili huu
        $registration->load('transaction');

        return Inertia::render('Admin/Marathon/Show', [
            'registration' => $registration,
        ]);
    }

    /**
     * BORESHO: Export marathon registrations data to a PDF file.
     */
    public function exportPdf(Request $request)
    {
        $registrations = $this->getFilteredRegistrations($request);

        $data = [
            'title' => 'Ripoti ya Washiriki wa Marathon',
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'registrations' => $registrations,
            'filters' => $request->only(['search', 'status']),
        ];

        // Utahitaji kutengeneza view: resources/views/reports/marathon_registrations_pdf.blade.php
        try {
            // REKEBISHO: Njia sahihi ya view ni 'reports.marathon_registrations_pdf'
            $pdf = PDF::loadView('reports.marathon_registrations_pdf', $data);
            return $pdf->download('marathon-registrations-report-' . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('PDF Export Failed: ' . $e->getMessage());
            return response('Could not generate PDF. Please check the logs.', 500);
        }
    }

    /**
     * BORESHO: Export marathon registrations data to an Excel file.
     */
    public function exportExcel(Request $request)
    {
        // Utahitaji kutengeneza Export class: app/Exports/MarathonRegistrationsExport.php
        return Excel::download(new MarathonRegistrationsExport($request), 'marathon-registrations-' . now()->format('Y-m-d') . '.xlsx');
    }

    /**
     * BORESHO: Reusable method to get filtered registrations.
     */
    private function getFilteredRegistrations(Request $request)
    {
        return MarathonRegistration::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone_number', 'like', "%{$search}%")
                        ->orWhere('unique_code', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get([
                'unique_code', 'full_name', 'phone_number', 'email',
                'race_type', 'region', 'country', 'tshirt_size',
                'status', 'created_at'
            ]);
    }
}