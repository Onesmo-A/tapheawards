<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketPurchase;
use App\Models\MarathonRegistration;
use App\Models\Nominee;
use App\Models\Category;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminExportController extends Controller
{
    /**
     * Export Ticket Purchases Registry as Branded PDF.
     */
    public function exportTicketsPdf()
    {
        $purchases = TicketPurchase::with('ticketType')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalRevenue = TicketPurchase::where('status', TicketPurchase::STATUS_COMPLETED)->sum('total_amount');
        $totalTickets = Ticket::count();
        $totalCheckedIn = Ticket::whereNotNull('checked_in_at')->count();

        $pdf = Pdf::loadView('pdf.tickets-pdf', [
            'purchases' => $purchases,
            'totalRevenue' => $totalRevenue,
            'totalTickets' => $totalTickets,
            'totalCheckedIn' => $totalCheckedIn,
        ]);

        return $pdf->download('tickets-registry-report.pdf');
    }

    /**
     * Export Marathon Registrations Registry as Branded PDF.
     */
    public function exportMarathonsPdf()
    {
        $registrations = MarathonRegistration::orderBy('created_at', 'desc')->get();

        $totalRunners = MarathonRegistration::count();
        $totalRevenue = MarathonRegistration::where('status', 'completed')->sum('amount');

        $pdf = Pdf::loadView('pdf.marathon-pdf', [
            'registrations' => $registrations,
            'totalRunners' => $totalRunners,
            'totalRevenue' => $totalRevenue,
        ]);

        return $pdf->download('marathon-registry-report.pdf');
    }

    /**
     * Export live Category Standings as Branded PDF.
     */
    public function exportStandingsPdf()
    {
        // Get all active categories with their nominees sorted by votes count
        $categories = Category::where('status', 'active')->orderBy('name')->get();
        
        $standings = [];
        $totalVotes = 0;

        foreach ($categories as $cat) {
            $nominees = Nominee::where('category_id', $cat->id)
                ->orderBy('votes_count', 'desc')
                ->get(['id', 'name', 'votes_count'])
                ->toArray();
                
            if (count($nominees) > 0) {
                $standings[$cat->name] = $nominees;
                $totalVotes += collect($nominees)->sum('votes_count');
            }
        }

        $pdf = Pdf::loadView('pdf.standings-pdf', [
            'standings' => $standings,
            'totalVotes' => $totalVotes,
        ]);

        return $pdf->download('live-vote-standings-report.pdf');
    }
}
