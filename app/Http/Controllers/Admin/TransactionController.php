<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NomineeApplication;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Onyesha orodha ya miamala yote.
     */
    public function index(Request $request)
    {
        $transactions = Transaction::query()
            ->with(['user:id,name', 'payable' => function ($query) {
                // Pakia taarifa za ombi husika (applicant_name)
                $query->select('id', 'applicant_name');
            }])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('order_id', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHasMorph('payable', [NomineeApplication::class], function ($q) use ($search) {
                        $q->where('applicant_name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Onyesha taarifa za muamala mmoja.
     */
    public function show(Transaction $transaction)
    {
        // Pakia taarifa zote muhimu zinazohusiana na muamala huu
        $transaction->load(['user', 'payable' => function ($query) {
            $query->with('category:id,name');
        }]);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Export transactions data to a PDF file.
     */
    public function exportPdf(Request $request)
    {
        $transactions = Transaction::query()
            ->with(['user:id,name', 'payable' => function ($query) {
                $query->select('id', 'applicant_name');
            }])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('order_id', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHasMorph('payable', [NomineeApplication::class], function ($q) use ($search) {
                        $q->where('applicant_name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->get();

        $data = [
            'title' => 'Ripoti ya Miamala ya Kifedha',
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
        ];

        $pdf = PDF::loadView('reports.transactions_pdf', $data);
        return $pdf->download('transactions-report-' . now()->format('Y-m-d') . '.pdf');
    }
}
