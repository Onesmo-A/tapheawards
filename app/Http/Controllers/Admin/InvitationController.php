<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuestInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class InvitationController extends Controller
{
    /**
     * Onyesha orodha ya mialiko yote.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'rsvp_status']);

        $invitations = GuestInvitation::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('guest_name', 'like', "%{$search}%")
                      ->orWhere('guest_title', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('rsvp_status'), function ($query, $rsvp_status) {
                $query->where('rsvp_status', $rsvp_status);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Invitations/Index', [
            'invitations' => $invitations,
            'filters' => $filters,
            'baseUrl' => url('/'), // Tuma base URL kwa ajili ya kunakili link
        ]);
    }

    /**
     * Onyesha fomu ya kutengeneza mwaliko mpya.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Invitations/Create');
    }

    /**
     * Hifadhi mwaliko mpya kwenye database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_title' => 'nullable|string|max:255',
            'event_name' => 'required|string|max:255',
            'event_description' => 'nullable|string|max:1000',
            'event_date' => 'required|string|max:255',
            'event_time' => 'required|string|max:255',
            'event_venue' => 'required|string|max:255',
            'dress_code' => 'required|string|max:255',
        ]);

        GuestInvitation::create([
            'guest_name' => $validated['guest_name'],
            'guest_title' => $validated['guest_title'],
            'event_name' => $validated['event_name'],
            'event_description' => $validated['event_description'],
            'event_date' => $validated['event_date'],
            'event_time' => $validated['event_time'],
            'event_venue' => $validated['event_venue'],
            'dress_code' => $validated['dress_code'],
            'uuid' => (string) Str::uuid(),
            'status' => 'pending', // Mwaliko unaanza kama 'pending'
        ]);

        return redirect()->route('admin.invitations.index')
            ->with('success', 'Mwaliko umetengenezwa kikamilifu.');
    }

    /**
     * Onyesha fomu ya kuhariri mwaliko.
     */
    public function edit(GuestInvitation $invitation): Response
    {
        return Inertia::render('Admin/Invitations/Edit', [
            'invitation' => $invitation,
        ]);
    }

    /**
     * Sasisha taarifa za mwaliko.
     */
    public function update(Request $request, GuestInvitation $invitation): RedirectResponse
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_title' => 'nullable|string|max:255',
            'event_name' => 'required|string|max:255',
            'event_description' => 'nullable|string|max:1000',
            'event_date' => 'required|string|max:255',
            'event_time' => 'required|string|max:255',
            'event_venue' => 'required|string|max:255',
            'dress_code' => 'required|string|max:255',
        ]);

        $invitation->update($validated);

        return redirect()->route('admin.invitations.index')
            ->with('success', 'Mwaliko umesahihishwa kikamilifu.');
    }

    /**
     * Futa mwaliko kutoka kwenye database.
     */
    public function destroy(GuestInvitation $invitation): RedirectResponse
    {
        $invitation->delete();

        return redirect()->route('admin.invitations.index')
            ->with('success', 'Mwaliko umefutwa.');
    }

    /**
     * Export invitations data to a PDF file.
     */
    public function exportPdf(Request $request)
    {
        $filters = $request->only(['search', 'rsvp_status']);
        $titleParts = ['Ripoti ya Mialiko ya Wageni'];

        $invitations = GuestInvitation::query()
            ->when($request->input('search'), function ($query, $search) use (&$titleParts) {
                $query->where('guest_name', 'like', "%{$search}%")
                      ->orWhere('guest_title', 'like', "%{$search}%");
                $titleParts[] = 'kwa "' . $search . '"';
            })
            ->when($request->input('rsvp_status'), function ($query, $rsvp_status) use (&$titleParts) {
                $query->where('rsvp_status', $rsvp_status);
                $titleParts[] = 'wenye RSVP status "' . $rsvp_status . '"';
            })
            ->latest()
            ->get();

        $title = count($titleParts) > 1 ? implode(' ', $titleParts) : 'Ripoti ya Mialiko Yote';

        $data = [
            'title' => $title,
            'date' => now()->setTimezone('Africa/Nairobi')->format('d M, Y H:i'),
            'invitations' => $invitations,
            'filters' => $filters,
        ];

        $pdf = PDF::loadView('reports.invitations_pdf', $data);
        $slug = 'invitations-report-' . now()->format('Y-m-d');

        return $pdf->download($slug . '.pdf');
    }
}
