<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nominee;
use App\Models\NomineeApplication;
use App\Models\Suggestion;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Transaction;
use App\Models\Vote;
use App\Models\VoteAttemptLog;
use App\Services\Audit\AuditLoggerService;
use App\Services\Voting\VoteIntegrityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminActivityController extends Controller
{
    public function getApplications(): JsonResponse
    {
        $applications = NomineeApplication::with('category', 'user')->latest()->get();
        return response()->json([
            'status' => 'success',
            'applications' => $applications,
        ]);
    }

    public function reviewApplication(Request $request, NomineeApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:approved,rejected',
        ]);

        $before = $application->toArray();
        $application->update([
            'status' => $validated['status'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        if ($validated['status'] === 'approved') {
            Nominee::create([
                'category_id' => $application->category_id,
                'name' => $application->applicant_name,
                'bio' => $application->bio,
                'facebook_url' => $application->facebook_url,
                'instagram_url' => $application->instagram_url,
                'tiktok_url' => $application->tiktok_url,
                'image_path' => $application->photo_path,
                'source_application_id' => $application->id,
                'is_suspended' => false,
            ]);
        }

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'REVIEW_NOMINEE_APPLICATION',
            modelType: NomineeApplication::class,
            modelId: $application->id,
            beforeState: $before,
            afterState: $application->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => $validated['status'] === 'approved' ? 'Ombi limepitishwa na mgombea ameongezwa.' : 'Ombi limekataliwa.',
            'application' => $application,
        ]);
    }

    public function getSuggestions(): JsonResponse
    {
        $suggestions = Suggestion::with('category')->latest()->get();
        return response()->json([
            'status' => 'success',
            'suggestions' => $suggestions,
        ]);
    }

    public function approveSuggestion(Request $request, Suggestion $suggestion): JsonResponse
    {
        $before = $suggestion->toArray();
        $suggestion->update(['status' => 'approved']);

        Nominee::create([
            'category_id' => $suggestion->category_id,
            'name' => $suggestion->suggested_nominee_name,
            'bio' => $suggestion->reason,
            'is_suspended' => false,
        ]);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'APPROVE_NOMINATION_SUGGESTION',
            modelType: Suggestion::class,
            modelId: $suggestion->id,
            beforeState: $before,
            afterState: $suggestion->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Pendekezo limepitishwa na mgombea ameongezwa.',
            'suggestion' => $suggestion,
        ]);
    }

    public function getUsers(): JsonResponse
    {
        $users = User::latest()->get();
        return response()->json([
            'status' => 'success',
            'users' => $users,
        ]);
    }

    public function getAuditLogs(): JsonResponse
    {
        $logs = AuditLog::with('adminUser')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $items = $logs->getCollection()->map(function ($log) {
            return [
                'id' => $log->id,
                'admin_name' => $log->adminUser->name ?? 'System',
                'action' => $log->action,
                'model_type' => $log->model_type,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at,
                'is_verified' => AuditLoggerService::verify($log),
            ];
        });

        return response()->json([
            'status' => 'success',
            'logs' => $items,
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function verifyVoteIntegrity(Request $request): JsonResponse
    {
        $admin = $request->user();
        $integrityService = new VoteIntegrityService();

        $votes = Vote::query()->get();
        $totalVotes = $votes->count();
        $tamperedCount = 0;
        $validCount = 0;

        foreach ($votes as $vote) {
            if ($integrityService->verify($vote)) {
                $validCount++;
            } else {
                $tamperedCount++;
            }
        }

        AuditLoggerService::log(
            adminUserId: $admin->id,
            action: 'RUN_VOTE_INTEGRITY_AUDIT',
            modelType: Vote::class,
            modelId: $admin->id,
            beforeState: ['status' => 'initiated'],
            afterState: [
                'total_audited' => $totalVotes,
                'valid_votes' => $validCount,
                'tampered_votes' => $tamperedCount,
            ]
        );

        return response()->json([
            'status' => 'success',
            'audit' => [
                'total_audited' => $totalVotes,
                'valid_votes' => $validCount,
                'tampered_votes' => $tamperedCount,
                'is_compromised' => $tamperedCount > 0,
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }

    public function getTransactions(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $query = Transaction::query()
            ->with('payable')
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('phone_number', 'like', "%{$search}%")
                    ->orWhere('gateway_reference', 'like', "%{$search}%")
                    ->orWhere('order_id', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, [
            Transaction::STATUS_PENDING,
            Transaction::STATUS_COMPLETED,
            Transaction::STATUS_FAILED,
            Transaction::STATUS_CANCELLED,
        ], true)) {
            $query->where('status', $status);
        }

        $transactions = $query->paginate(15);
        $items = collect($transactions->items())->map(function (Transaction $transaction) {
            return [
                'id' => $transaction->id,
                'order_id' => $transaction->order_id,
                'gateway_reference' => $transaction->gateway_reference,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency,
                'status' => $transaction->status,
                'payment_method' => $transaction->payment_method,
                'phone_number' => $transaction->phone_number,
                'created_at' => $transaction->created_at,
                'payable_type' => class_basename($transaction->payable_type),
                'payable_id' => $transaction->payable_id,
            ];
        });

        return response()->json([
            'status' => 'success',
            'transactions' => $items,
            'summary' => [
                'total' => Transaction::count(),
                'completed' => Transaction::where('status', Transaction::STATUS_COMPLETED)->count(),
                'pending' => Transaction::where('status', Transaction::STATUS_PENDING)->count(),
                'failed' => Transaction::where('status', Transaction::STATUS_FAILED)->count(),
                'cancelled' => Transaction::where('status', Transaction::STATUS_CANCELLED)->count(),
                'completed_amount' => (float) Transaction::where('status', Transaction::STATUS_COMPLETED)->sum('amount'),
                'completed_voting_amount' => (float) Transaction::where('status', Transaction::STATUS_COMPLETED)
                    ->where(function($q) {
                        $q->where('payable_type', 'like', '%VoteOrder%')
                          ->orWhere('payable_type', 'like', '%Vote%');
                    })->sum('amount'),
                'completed_nomination_amount' => (float) Transaction::where('status', Transaction::STATUS_COMPLETED)
                    ->where(function($q) {
                        $q->where('payable_type', 'like', '%NomineeApplication%')
                          ->orWhere('payable_type', 'like', '%Application%');
                    })->sum('amount'),
            ],
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    public function getVoteAttemptLogs(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = VoteAttemptLog::with(['nominee', 'category'])
            ->when($search, function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('reason', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('subnet', 'like', "%{$search}%")
                        ->orWhere('asn_name', 'like', "%{$search}%")
                        ->orWhere('fingerprint_js', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->latest('attempted_at');

        $logs = $query->paginate(15);

        return response()->json([
            'status' => 'success',
            'attempts' => $logs->getCollection()->map(fn (VoteAttemptLog $log) => [
                'id' => $log->id,
                'status' => $log->status,
                'reason' => $log->reason,
                'ip_address' => $log->ip_address,
                'subnet' => $log->subnet,
                'risk_score' => $log->risk_score,
                'vpn_detected' => $log->vpn_detected,
                'proxy_detected' => $log->proxy_detected,
                'hosting_detected' => $log->hosting_detected,
                'rate_limited' => $log->rate_limited,
                'asn_name' => $log->asn_name,
                'nominee_name' => $log->nominee?->name,
                'category_name' => $log->category?->name,
                'attempted_at' => $log->attempted_at,
            ]),
            'summary' => [
                'success' => VoteAttemptLog::where('status', 'success')->count(),
                'blocked' => VoteAttemptLog::where('status', 'blocked')->count(),
                'duplicate' => VoteAttemptLog::where('status', 'duplicate')->count(),
                'high_risk' => VoteAttemptLog::where('risk_score', '>=', 70)->count(),
                'vpn_or_proxy' => VoteAttemptLog::where(function ($query) {
                    $query->where('vpn_detected', true)
                        ->orWhere('proxy_detected', true)
                        ->orWhere('hosting_detected', true);
                })->count(),
                'rate_limited' => VoteAttemptLog::where('rate_limited', true)->count(),
            ],
            'pagination' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    public function getSponsorships(): JsonResponse
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('sponsorship_inquiries')) {
            return response()->json([
                'status' => 'success',
                'sponsorships' => [],
            ]);
        }
        
        $sponsorships = \App\Models\SponsorshipInquiry::latest()->get();
        return response()->json([
            'status' => 'success',
            'sponsorships' => $sponsorships,
        ]);
    }

    public function markSponsorshipContacted(Request $request, \App\Models\SponsorshipInquiry $inquiry): JsonResponse
    {
        $before = $inquiry->toArray();
        $inquiry->update(['status' => 'contacted']);

        AuditLoggerService::log(
            adminUserId: $request->user()->id,
            action: 'MARK_SPONSORSHIP_CONTACTED',
            modelType: \App\Models\SponsorshipInquiry::class,
            modelId: $inquiry->id,
            beforeState: $before,
            afterState: $inquiry->toArray()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Ombi limewekwa alama kuwa mawasiliano yamefanyika.',
            'inquiry' => $inquiry,
        ]);
    }
}
