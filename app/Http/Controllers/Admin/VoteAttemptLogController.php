<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\VoteAttemptLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoteAttemptLogController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'category_id', 'date_from', 'date_to']);

        $logs = VoteAttemptLog::with(['nominee', 'category'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('reason', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('subnet', 'like', "%{$search}%")
                        ->orWhere('asn_name', 'like', "%{$search}%")
                        ->orWhere('fingerprint_js', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->input('category_id'), fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($request->input('date_from'), fn ($query, $dateFrom) => $query->whereDate('attempted_at', '>=', $dateFrom))
            ->when($request->input('date_to'), fn ($query, $dateTo) => $query->whereDate('attempted_at', '<=', $dateTo))
            ->latest('attempted_at')
            ->paginate(25)
            ->withQueryString();

        $voteAuditWarnings = [
            'success_attempts' => VoteAttemptLog::query()->where('status', 'success')->count(),
            'blocked_attempts' => VoteAttemptLog::query()->where('status', 'blocked')->count(),
            'duplicate_attempts' => VoteAttemptLog::query()->where('status', 'duplicate')->count(),
            'bot_attempts' => VoteAttemptLog::query()->where('reason', 'like', '%Bot-like%')->count(),
            'vpn_attempts' => VoteAttemptLog::query()->where('reason', 'like', '%VPN%')->count(),
        ];

        $topSuspiciousIps = VoteAttemptLog::query()
            ->select('ip_address', DB::raw('COUNT(*) as attempts'))
            ->where('status', 'blocked')
            ->groupBy('ip_address')
            ->orderByDesc('attempts')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/VoteAttemptLogs/Index', [
            'logs' => $logs,
            'filters' => $filters,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'voteAuditWarnings' => $voteAuditWarnings,
            'topSuspiciousIps' => $topSuspiciousIps,
        ]);
    }

    public function prune(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'older_than_days' => 'required|integer|min:1|max:3650',
        ]);

        $deleted = VoteAttemptLog::where('attempted_at', '<', now()->subDays($validated['older_than_days']))->delete();

        return back()->with('success', "Imefutwa historia ya attempts {$deleted} za kura zilizokuwa zaidi ya siku {$validated['older_than_days']}.");
    }
}
