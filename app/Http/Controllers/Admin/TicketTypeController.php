<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticketTypes = TicketType::query()
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/TicketTypes/Index', [
            'ticketTypes' => $ticketTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/TicketTypes/Form', [
            'ticketType' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateTicketType($request);

        TicketType::create($validated);

        return redirect()->route('admin.ticket-types.index')->with('success', 'Aina ya tiketi imetengenezwa kikamilifu.');
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     // Route for this is excluded
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TicketType $ticketType)
    {
        return Inertia::render('Admin/TicketTypes/Form', [
            'ticketType' => $ticketType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TicketType $ticketType)
    {
        $validated = $this->validateTicketType($request, $ticketType->id);

        $ticketType->update($validated);

        return redirect()->route('admin.ticket-types.index')->with('success', 'Aina ya tiketi imesahihishwa kikamilifu.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketType $ticketType)
    {
        // Kagua kama kuna manunuzi yaliyofanyika kwa aina hii ya tiketi
        if ($ticketType->ticketPurchases()->exists()) {
            return redirect()->back()->with('error', 'Huwezi kufuta aina hii ya tiketi kwa sababu tayari ina manunuzi yaliyofanyika.');
        }

        $ticketType->delete();

        return redirect()->route('admin.ticket-types.index')->with('success', 'Aina ya tiketi imefutwa.');
    }

    /**
     * Validate the request for creating/updating a ticket type.
     */
    private function validateTicketType(Request $request, $id = null): array
    {
        $rules = [
            'name' => 'required|string|max:255|unique:ticket_types,name,' . $id,
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'quantity_available' => 'nullable|integer|min:0',
            'is_active' => 'required|boolean',
            'features' => 'nullable|array',
            'features.*' => 'nullable|string|max:255', // Hakikisha kila feature ni string
        ];

        $validated = $request->validate($rules);

        // Safisha features, ondoa zilizo tupu
        if (isset($validated['features'])) {
            $validated['features'] = array_values(array_filter($validated['features']));
        }

        return $validated;
    }
}
