<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\TicketPaymentCompleted;
use App\Models\Ticket;
use App\Models\TicketPurchase;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Onyesha dashboard ya tiketi.
     */
    public function dashboard(Request $request)
    {
        $purchases = TicketPurchase::query()
            ->with(['ticketType', 'user', 'mainTransaction', 'tickets']) // BORESHO: Ongeza 'tickets'
            ->when($request->input('search'), function ($query, $search) {
                $query->where('purchaser_name', 'like', "%{$search}%")
                    ->orWhere('purchaser_email', 'like', "%{$search}%")
                    ->orWhereHas('mainTransaction', fn ($q) => $q->where('order_id', 'like', "%{$search}%"));
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // REKEBISHO: Badilisha majina ya keys kuwa camelCase ili yalingane na Vue component.
        $stats = [
            'totalSold' => TicketPurchase::where('status', TicketPurchase::STATUS_COMPLETED)->sum('quantity'),
            'revenue' => TicketPurchase::where('status', TicketPurchase::STATUS_COMPLETED)->sum('total_amount'),
            'checkedIn' => Ticket::whereNotNull('checked_in_at')->count(),
        ];

        return Inertia::render('Admin/Tickets/Dashboard', [
            'purchases' => $purchases,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Onyesha fomu ya kuunda tiketi kwa admin.
     */
    public function create()
    {
        return Inertia::render('Admin/Tickets/Form', [
            'ticketTypes' => TicketType::where('is_active', true)->get(),
        ]);
    }

    /**
     * Hifadhi tiketi iliyoundwa na admin.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_type_id' => 'required|exists:ticket_types,id',
            'purchaser_name' => 'required|string|max:255',
            'purchaser_email' => 'required|email|max:255',
            'quantity' => 'required|integer|min:1',
            'send_email' => 'required|boolean',
        ]);

        $ticketType = TicketType::findOrFail($validated['ticket_type_id']);

        try {
            $purchase = DB::transaction(function () use ($validated, $ticketType) {
                $purchase = TicketPurchase::create([
                    'ticket_type_id' => $ticketType->id,
                    'purchaser_name' => $validated['purchaser_name'],
                    'purchaser_email' => $validated['purchaser_email'],
                    'quantity' => $validated['quantity'],
                    'total_amount' => 0, // Admin generated, no cost
                    'status' => TicketPurchase::STATUS_COMPLETED, // Mark as completed directly
                ]);

                // The generateTickets() method is called automatically by the model's 'updated' event observer
                return $purchase;
            });

            if ($validated['send_email']) {
                Mail::to($purchase->purchaser_email)->queue(new TicketPaymentCompleted($purchase));
            }

            return redirect()->route('admin.tickets.dashboard')->with('success', 'Tiketi zimetengenezwa kikamilifu.');
        } catch (\Exception $e) {
            Log::error('Admin ticket creation failed: ' . $e->getMessage());
            return back()->with('error', 'Imeshindwa kutengeneza tiketi. Tafadhali jaribu tena.');
        }
    }

    /**
     * Tuma tena barua pepe ya tiketi kwa mnunuaji.
     */
    public function resendTicket(TicketPurchase $purchase)
    {
        Mail::to($purchase->purchaser_email)->queue(new TicketPaymentCompleted($purchase));

        return back()->with('success', "Barua pepe ya tiketi imetumwa tena kwa {$purchase->purchaser_email}.");
    }

    /**
     * BORESHO: Onyesha ukurasa wa kuskani tiketi.
     */
    public function showScanner()
    {
        // BORESHO: Pata takwimu za tiketi na uzitumwe kwenye view
        $stats = [
            'totalSold' => TicketPurchase::where('status', TicketPurchase::STATUS_COMPLETED)->sum('quantity'),
            'checkedIn' => Ticket::whereNotNull('checked_in_at')->count(),
        ];

        return Inertia::render('Admin/Tickets/Scan', ['stats' => $stats]);
    }

    /**
     * BORESHO: Hakiki tiketi iliyoskaniwa.
     */
    public function verifyTicket(Request $request)
    {
        $validated = $request->validate([
            'ticket_code' => 'required|string|exists:tickets,ticket_code',
        ]);

        // REKEBISHO: Badilisha 'purchase' kuwa 'ticketPurchase' ili ilingane na jina la uhusiano kwenye Model.
        $ticket = Ticket::with('ticketPurchase.ticketType')
            ->where('ticket_code', $validated['ticket_code'])
            ->first();

        if (!$ticket) {
            // Hii haitatokea kwa kawaida kutokana na 'exists' rule, lakini ni kinga.
            return response()->json(['status' => 'error', 'message' => 'Tiketi haipo.'], 404);
        }

        if ($ticket->checked_in_at) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Hii tiketi tayari imeshatumika.',
                'ticket' => $ticket->load('ticketPurchase.ticketType'), // REKEBISHO: Pakia uhusiano sahihi
                'checked_in_time' => $ticket->checked_in_at->format('d M, Y H:i:s'),
            ], 409);
        }

        $ticket->update(['checked_in_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tiketi imethibitishwa. Karibu!',
            'ticket' => $ticket->load('ticketPurchase.ticketType'), // REKEBISHO: Pakia uhusiano sahihi
        ]);
    }
}