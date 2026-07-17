<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\MarathonRegistration;
use App\Models\Nominee;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\TicketPurchase;
use App\Models\Vote;
use App\Models\VoteAttemptLog;
use App\Models\VoteOrder;
use App\Services\Audit\AuditLoggerService;
use App\Services\Voting\VoteIntegrityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminOverviewController extends Controller
{
    /**
     * Retrieve aggregated dashboard stats.
     */
    public function getStats(): JsonResponse
    {
        $activeSeason = Setting::where('key', 'active_season')->first()?->value ?? '2026';

        $totalVotes = DB::table('votes')->sum('votes_count');
        $totalRevenue = VoteOrder::where('status', VoteOrder::STATUS_COMPLETED)->sum('amount');
        $marathonFee = Setting::where('key', 'marathon_fee')->first()?->value ?? '35000';
        $marathonCount = MarathonRegistration::count();
        $marathonRevenue = MarathonRegistration::where('status', 'completed')->count() * (int) $marathonFee;

        $categoriesCount = Category::count();
        $nomineesCount = Nominee::count();
        $ticketCount = TicketPurchase::count();
        $ticketRevenue = TicketPurchase::where('status', TicketPurchase::STATUS_COMPLETED)->sum('total_amount');

        $applicationsCount = \App\Models\NomineeApplication::count();
        $applicationsPendingCount = \App\Models\NomineeApplication::where('status', 'pending_review')->count();
        $applicationsRevenue = Transaction::where('status', Transaction::STATUS_COMPLETED)
            ->where(function($q) {
                $q->where('payable_type', 'like', '%NomineeApplication%')
                  ->orWhere('payable_type', 'like', '%Application%');
            })->sum('amount');

        $paymentSummary = [
            'completed' => Transaction::where('status', Transaction::STATUS_COMPLETED)->count(),
            'pending' => Transaction::where('status', Transaction::STATUS_PENDING)->count(),
            'failed' => Transaction::where('status', Transaction::STATUS_FAILED)->count(),
            'cancelled' => Transaction::where('status', Transaction::STATUS_CANCELLED)->count(),
            'total' => Transaction::count(),
            'transaction_count' => Transaction::count(),
            'completed_amount' => (float) Transaction::where('status', Transaction::STATUS_COMPLETED)->sum('amount'),
            'total_revenue' => (float) Transaction::where('status', Transaction::STATUS_COMPLETED)->sum('amount'),
        ];

        $voteOrderSummary = [
            'completed' => VoteOrder::where('status', VoteOrder::STATUS_COMPLETED)->count(),
            'pending' => VoteOrder::where('status', VoteOrder::STATUS_PENDING)->count(),
            'failed' => VoteOrder::where('status', VoteOrder::STATUS_FAILED)->count(),
        ];

        $integrityService = new VoteIntegrityService();
        $sampleVotes = Vote::query()->latest()->limit(250)->get();
        $tamperedSampleVotes = $sampleVotes->filter(fn ($vote) => ! $integrityService->verify($vote))->count();
        $recentAuditLogs = AuditLog::with('adminUser')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        $unverifiedAuditLogs = $recentAuditLogs
            ->filter(fn ($log) => ! AuditLoggerService::verify($log))
            ->count();

        $voteAttemptSummary = [
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
        ];

        $recentLogs = AuditLog::with('adminUser')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        $recentLogsPayload = $recentLogs->map(function (AuditLog $log) {
            return [
                'id' => $log->id,
                'action' => $log->action,
                'model_type' => $log->model_type,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at,
                'admin_user' => $log->adminUser ? [
                    'name' => $log->adminUser->name,
                    'role' => $log->adminUser->role,
                ] : null,
                'is_verified' => AuditLoggerService::verify($log),
            ];
        });

        $tamperedRecentLogs = $recentLogsPayload->where('is_verified', false)->count();
        $issueCount = $paymentSummary['failed'] + $voteOrderSummary['failed'] + $tamperedRecentLogs + $tamperedSampleVotes;

        return response()->json([
            'status' => 'success',
            'stats' => [
                'active_season' => $activeSeason,
                'total_votes' => (int) $totalVotes,
                'total_revenue' => (float) $totalRevenue,
                'categories_count' => $categoriesCount,
                'nominees_count' => $nomineesCount,
                'marathon_count' => $marathonCount,
                'marathon_revenue' => (float) $marathonRevenue,
                'ticket_count' => $ticketCount,
                'ticket_revenue' => (float) $ticketRevenue,
                'applications_count' => $applicationsCount,
                'applications_pending_count' => $applicationsPendingCount,
                'applications_revenue' => (float) $applicationsRevenue,
                'payment_summary' => $paymentSummary,
                'vote_order_summary' => $voteOrderSummary,
                'security_summary' => [
                    'sample_votes_checked' => $sampleVotes->count(),
                    'tampered_sample_votes' => $tamperedSampleVotes,
                    'recent_logs_checked' => $recentAuditLogs->count(),
                    'unverified_recent_logs' => $unverifiedAuditLogs,
                    'vote_attempts' => $voteAttemptSummary,
                ],
                'health' => [
                    'voting_status' => $nomineesCount > 0 && $categoriesCount > 0 ? 'live' : 'setup',
                    'payment_status' => $paymentSummary['failed'] > 0 ? 'attention' : 'settled',
                    'integrity_status' => ($tamperedRecentLogs + $tamperedSampleVotes) > 0 ? 'attention' : 'verified',
                    'issue_count' => $issueCount,
                ],
            ],
            'recent_logs' => $recentLogsPayload,
            'process_queue' => [
                ['label' => 'Failed payments', 'count' => $paymentSummary['failed'], 'tone' => $paymentSummary['failed'] > 0 ? 'danger' : 'good'],
                ['label' => 'Pending payments', 'count' => $paymentSummary['pending'], 'tone' => $paymentSummary['pending'] > 0 ? 'warning' : 'muted'],
                ['label' => 'Pending applications', 'count' => $applicationsPendingCount, 'tone' => $applicationsPendingCount > 0 ? 'warning' : 'muted'],
                ['label' => 'Pending vote orders', 'count' => $voteOrderSummary['pending'], 'tone' => $voteOrderSummary['pending'] > 0 ? 'warning' : 'muted'],
                ['label' => 'Tamper signals', 'count' => $tamperedRecentLogs + $tamperedSampleVotes, 'tone' => ($tamperedRecentLogs + $tamperedSampleVotes) > 0 ? 'danger' : 'good'],
            ],
        ]);
    }
}