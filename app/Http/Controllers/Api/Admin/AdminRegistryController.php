<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketPurchase;
use App\Models\MarathonRegistration;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminRegistryController extends Controller
{
    // ==========================================
    // TICKET DESK & CHECK-IN
    // ==========================================
    public function getTicketPurchases(): JsonResponse
    {
        $purchases = TicketPurchase::with('ticketType', 'tickets')->latest()->get();
        return response()->json([
            'status' => 'success',
            'purchases' => $purchases
        ]);
    }

    public function checkInTicket(Request $request, Ticket $ticket): JsonResponse
    {
        if ($ticket->checked_in_at) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tiketi hii tayari ishatumika kuingia.'
            ], 422);
        }

        $before = $ticket->toArray();
        $ticket->update([
            'checked_in_at' => now(),
            'checked_in_by' => $request->user()->id
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CHECK_IN_TICKET',
            modelType: Ticket::class,
            modelId: $ticket->id,
            beforeState: $before,
            afterState: $ticket->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Mgeni ameingizwa kikamilifu.',
            'ticket' => $ticket
        ]);
    }

    public function checkInTicketByCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticket_code' => 'required|string',
        ]);

        $code = trim($validated['ticket_code']);

        // 1. Cryptographic validation of authenticity
        if (!Ticket::verifyCode($code)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tiketi sio halali! Code imetengenezwa nje ya mfumo wetu.'
            ], 422);
        }

        // 2. Database validation
        $ticket = Ticket::with('ticketPurchase.ticketType')
            ->where('ticket_code', $code)
            ->first();

        if (!$ticket) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tiketi haikupatikana kwenye database.'
            ], 404);
        }

        // 3. Replay prevention
        if ($ticket->checked_in_at) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tiketi hii tayari imeshatumika kuingia tarehe: ' . $ticket->checked_in_at->format('d M, Y H:i:s')
            ], 422);
        }

        // 4. Perform check-in and log
        $before = $ticket->toArray();
        $ticket->update([
            'checked_in_at' => now(),
            'checked_in_by' => $request->user()->id
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CHECK_IN_TICKET_BY_CODE',
            modelType: Ticket::class,
            modelId: $ticket->id,
            beforeState: $before,
            afterState: $ticket->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Tiketi imethibitishwa! Karibu ' . ($ticket->ticketPurchase?->purchaser_name ?? 'Mgeni') . '.',
            'ticket' => $ticket
        ]);
    }

    // ==========================================
    // MARATHON DESK
    // ==========================================
    public function getMarathonRegistrations(): JsonResponse
    {
        $registrations = MarathonRegistration::latest()->get();
        return response()->json([
            'status' => 'success',
            'registrations' => $registrations
        ]);
    }

    // ==========================================
    // TICKET TYPES CRUD
    // ==========================================
    public function getTicketTypes(): JsonResponse
    {
        $types = \App\Models\TicketType::latest()->get();
        return response()->json([
            'status' => 'success',
            'ticket_types' => $types
        ]);
    }

    public function storeTicketType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity_available' => 'nullable|integer|min:0',
            'is_active' => 'required|boolean',
            'features' => 'nullable|array',
        ]);

        $type = \App\Models\TicketType::create($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'CREATE_TICKET_TYPE',
            modelType: \App\Models\TicketType::class,
            modelId: $type->id,
            beforeState: null,
            afterState: $type->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Aina ya tiketi imeundwa.',
            'ticket_type' => $type
        ]);
    }

    public function updateTicketType(Request $request, \App\Models\TicketType $ticketType): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity_available' => 'nullable|integer|min:0',
            'is_active' => 'required|boolean',
            'features' => 'nullable|array',
        ]);

        $before = $ticketType->toArray();
        $ticketType->update($validated);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'UPDATE_TICKET_TYPE',
            modelType: \App\Models\TicketType::class,
            modelId: $ticketType->id,
            beforeState: $before,
            afterState: $ticketType->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Aina ya tiketi imesasishwa.',
            'ticket_type' => $ticketType
        ]);
    }

    public function toggleTicketTypeStatus(Request $request, \App\Models\TicketType $ticketType): JsonResponse
    {
        $before = $ticketType->toArray();
        $ticketType->update([
            'is_active' => !$ticketType->is_active
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'TOGGLE_TICKET_TYPE_STATUS',
            modelType: \App\Models\TicketType::class,
            modelId: $ticketType->id,
            beforeState: $before,
            afterState: $ticketType->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => $ticketType->is_active ? 'Aina ya tiketi imekuwa active.' : 'Aina ya tiketi imesimamishwa.',
            'ticket_type' => $ticketType
        ]);
    }

    public function deleteTicketType(Request $request, \App\Models\TicketType $ticketType): JsonResponse
    {
        if ($ticketType->ticketPurchases()->count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Huwezi kufuta aina hii ya tiketi kwa sababu tayari ina mauzo yaliyofanyika.'
            ], 422);
        }

        $before = $ticketType->toArray();
        $ticketType->delete();

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'DELETE_TICKET_TYPE',
            modelType: \App\Models\TicketType::class,
            modelId: $ticketType->id,
            beforeState: $before,
            afterState: null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Aina ya tiketi imefutwa.'
        ]);
    }
}
