<?php

namespace App\Services\Voting;

use App\Models\Nominee;
use App\Models\Setting;
use App\Models\Vote;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class VoteSubmissionService
{
    public function __construct(
        private readonly VoteBehaviorScorer $behaviorScorer,
        private readonly VoteNetworkMonitor $networkMonitor,
        private readonly VoteAttemptLogger $attemptLogger,
        private readonly VoteSessionService $voteSessionService,
    ) {
    }

    public function submit(Nominee $nominee, Request $request, array $validated): array
    {
        $settings = Cache::remember('app_settings', 3600, function () {
            return Setting::query()->pluck('value', 'key');
        });

        $nominee->loadMissing('category');

        if (! (bool) $settings->get('voting_active', true)) {
            return $this->blocked($request, $nominee, $validated, 'Voting is currently disabled.', 403, 'voting_disabled');
        }

        $deadline = $settings->get('voting_deadline');
        if ($deadline && Carbon::now()->isAfter(Carbon::parse($deadline))) {
            return $this->blocked($request, $nominee, $validated, 'Sorry, the voting period has ended.', 403, 'voting_deadline_passed');
        }

        if ($nominee->is_suspended) {
            return $this->blocked($request, $nominee, $validated, 'This nominee is currently suspended from voting.', 403, 'nominee_suspended');
        }

        if (! $nominee->category || ! $nominee->category->voting_enabled || $nominee->category->status !== 'active') {
            return $this->blocked($request, $nominee, $validated, 'Voting is currently disabled for this category.', 403, 'category_disabled');
        }

        if (! empty(trim((string) ($validated['website'] ?? '')))) {
            return $this->blocked($request, $nominee, $validated, 'Automated voting is not allowed. Please use a regular browser.', 403, 'honeypot_triggered', [
                'honeypot_detected' => true,
            ]);
        }

        $userAgent = (string) ($request->userAgent() ?? '');

        if ($this->isLikelyBotUserAgent($userAgent)) {
            return $this->blocked($request, $nominee, $validated, 'Automated voting is not allowed. Please use a regular browser.', 403, 'bot_user_agent', [
                'user_agent' => $userAgent,
            ]);
        }

        $behaviorMetrics = $this->behaviorScorer->normalize($validated);
        $behaviorScore = $this->behaviorScorer->score($behaviorMetrics);

        $rateLimit = $this->checkRateLimit($request);
        if ($rateLimit['limited']) {
            return $this->blocked($request, $nominee, $validated, 'Too many vote attempts. Please wait before trying again.', 429, 'rate_limited', [
                'behavior_metrics' => $behaviorMetrics,
                'risk_score' => $behaviorScore['risk_score'],
                'triggered_rules' => $behaviorScore['triggered_rules'],
                'rate_limited' => true,
            ], [], 'rate_limited');
        }

        try {
            $sessionPayload = $this->voteSessionService->consume($nominee, $request, (string) $validated['vote_session_token']);
        } catch (VoteSessionException $e) {
            return $this->blocked($request, $nominee, $validated, 'Your voting session is invalid or expired. Please reload the page and try again.', 403, 'invalid_vote_session', [
                'session_error' => $e->getMessage(),
            ]);
        }

        if (! $this->voteSessionService->consumeNonce((string) ($sessionPayload['jti'] ?? ''), (string) $validated['vote_nonce'])) {
            return $this->blocked($request, $nominee, $validated, 'This vote request has already been used. Please reload the page and try again.', 403, 'replayed_nonce', [
                'session_jti' => $sessionPayload['jti'] ?? null,
            ]);
        }

        $windowStart = now()->subHours((int) config('voting.voting_window_hours', 24));
        $networkSignals = $this->networkMonitor->inspect($request, $windowStart);

        $fingerprints = $this->generateFingerprints($request, $validated);

        if ($networkSignals['suspicious'] || $networkSignals['asn_detected']) {
            $this->attemptLogger->log(
                $request,
                $nominee,
                $validated,
                'suspicious',
                'Suspicious network activity detected.',
                $fingerprints,
                [
                    'subnet' => $networkSignals['subnet'],
                    'vpn_detected' => $networkSignals['vpn_detected'],
                    'proxy_detected' => $networkSignals['proxy_detected'],
                    'hosting_detected' => $networkSignals['hosting_detected'],
                    'asn_detected' => $networkSignals['asn_detected'],
                    'asn_name' => $networkSignals['asn_name'],
                    'behavior_metrics' => $behaviorMetrics,
                    'network_monitoring' => $networkSignals,
                    'risk_score' => $behaviorScore['risk_score'],
                    'triggered_rules' => $behaviorScore['triggered_rules'],
                    'rate_limited' => false,
                ]
            );
        }

        if ($networkSignals['vpn_detected'] || $networkSignals['proxy_detected'] || $networkSignals['hosting_detected']) {
            return $this->blocked($request, $nominee, $validated, 'VPN or proxy use is not allowed for voting.', 403, 'vpn_or_proxy', [
                'behavior_metrics' => $behaviorMetrics,
                'risk_score' => $behaviorScore['risk_score'],
                'triggered_rules' => $behaviorScore['triggered_rules'],
                'subnet' => $networkSignals['subnet'],
                'vpn_detected' => $networkSignals['vpn_detected'],
                'proxy_detected' => $networkSignals['proxy_detected'],
                'hosting_detected' => $networkSignals['hosting_detected'],
                'asn_detected' => $networkSignals['asn_detected'],
                'asn_name' => $networkSignals['asn_name'],
                'rate_limited' => false,
            ], $fingerprints, 'blocked');
        }

        if ($behaviorScore['blocked']) {
            return $this->blocked($request, $nominee, $validated, 'Your voting behavior looks automated. Please slow down and try again.', 403, 'behavioral_risk', [
                'behavior_metrics' => $behaviorMetrics,
                'risk_score' => $behaviorScore['risk_score'],
                'triggered_rules' => $behaviorScore['triggered_rules'],
                'subnet' => $networkSignals['subnet'],
                'vpn_detected' => $networkSignals['vpn_detected'],
                'proxy_detected' => $networkSignals['proxy_detected'],
                'hosting_detected' => $networkSignals['hosting_detected'],
                'rate_limited' => false,
            ], $fingerprints, 'blocked');
        }

        $windowStart = now()->subHours((int) config('voting.voting_window_hours', 24));
        $recentVote = Vote::query()
            ->where('category_id', $nominee->category_id)
            ->where('voted_at', '>=', $windowStart)
            ->where(function ($query) use ($validated, $fingerprints) {
                $query->where('fingerprint_js', $validated['fingerprint_js'])
                    ->orWhere('multi_factor_hash', $fingerprints['multi_factor_hash']);
            })
            ->latest('voted_at')
            ->first();

        if ($recentVote) {
            $signal = $recentVote->fingerprint_js === $validated['fingerprint_js']
                ? 'fingerprint_js'
                : 'multi_factor_hash';

            return $this->blocked($request, $nominee, $validated, 'You have already voted in this category within the last 24 hours. Please try again after your voting window expires.', 429, 'duplicate_vote', [
                'signal' => $signal,
                'recent_vote_id' => $recentVote->id,
                'recent_vote_time' => $recentVote->voted_at,
                'behavior_metrics' => $behaviorMetrics,
                'risk_score' => $behaviorScore['risk_score'],
                'triggered_rules' => $behaviorScore['triggered_rules'],
                'subnet' => $networkSignals['subnet'],
                'vpn_detected' => $networkSignals['vpn_detected'],
                'proxy_detected' => $networkSignals['proxy_detected'],
                'hosting_detected' => $networkSignals['hosting_detected'],
                'rate_limited' => false,
            ], $fingerprints, 'duplicate');
        }

        try {
            DB::transaction(function () use ($request, $nominee, $validated, $fingerprints, $userAgent, $behaviorMetrics) {
                $nominee->votes()->create([
                    'category_id' => $nominee->category_id,
                    'ip_address' => $request->ip(),
                    'user_agent' => $userAgent,
                    'fingerprint' => $fingerprints['backend_fingerprint'],
                    'fingerprint_js' => $validated['fingerprint_js'],
                    'screen_resolution' => $validated['screen_resolution'],
                    'timezone' => $validated['timezone'],
                    'language' => $validated['language'],
                    'page_time_seconds' => $behaviorMetrics['page_time_seconds'],
                    'mouse_move_count' => $behaviorMetrics['mouse_move_count'],
                    'scroll_count' => $behaviorMetrics['scroll_count'],
                    'focus_count' => $behaviorMetrics['focus_count'],
                    'blur_count' => $behaviorMetrics['blur_count'],
                    'multi_factor_hash' => $fingerprints['multi_factor_hash'],
                    'voted_at' => now(),
                ]);
            });
        } catch (QueryException $e) {
            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                return $this->blocked($request, $nominee, $validated, 'You have already voted in this category within the last 24 hours.', 429, 'database_unique', [
                    'behavior_metrics' => $behaviorMetrics,
                    'risk_score' => $behaviorScore['risk_score'],
                    'triggered_rules' => $behaviorScore['triggered_rules'],
                    'subnet' => $networkSignals['subnet'],
                    'vpn_detected' => $networkSignals['vpn_detected'],
                    'proxy_detected' => $networkSignals['proxy_detected'],
                    'hosting_detected' => $networkSignals['hosting_detected'],
                    'rate_limited' => false,
                ], $fingerprints, 'duplicate');
            }

            Log::error('Vote creation DB error.', [
                'nominee_id' => $nominee->id,
                'ip_address' => $request->ip(),
                'error' => $e->getMessage(),
            ]);

            $this->attemptLogger->log(
                $request,
                $nominee,
                $validated,
                'error',
                'Database error while saving vote.',
                $fingerprints,
                [
                    'behavior_metrics' => $behaviorMetrics,
                    'risk_score' => $behaviorScore['risk_score'],
                    'triggered_rules' => $behaviorScore['triggered_rules'],
                    'subnet' => $networkSignals['subnet'],
                    'vpn_detected' => $networkSignals['vpn_detected'],
                    'proxy_detected' => $networkSignals['proxy_detected'],
                    'hosting_detected' => $networkSignals['hosting_detected'],
                    'rate_limited' => false,
                ]
            );

            return [
                'status' => 500,
                'message' => 'Server error, please try again later.',
            ];
        } catch (\Throwable $e) {
            Log::error('Unexpected vote error.', [
                'nominee_id' => $nominee->id,
                'ip_address' => $request->ip(),
                'error' => $e->getMessage(),
            ]);

            $this->attemptLogger->log(
                $request,
                $nominee,
                $validated,
                'error',
                'Unexpected error while saving vote.',
                $fingerprints,
                [
                    'behavior_metrics' => $behaviorMetrics,
                    'risk_score' => $behaviorScore['risk_score'],
                    'triggered_rules' => $behaviorScore['triggered_rules'],
                    'subnet' => $networkSignals['subnet'],
                    'vpn_detected' => $networkSignals['vpn_detected'],
                    'proxy_detected' => $networkSignals['proxy_detected'],
                    'hosting_detected' => $networkSignals['hosting_detected'],
                    'rate_limited' => false,
                ]
            );

            return [
                'status' => 500,
                'message' => 'Server error, please try again later.',
            ];
        }

        $this->attemptLogger->log(
            $request,
            $nominee,
            $validated,
            'success',
            'Vote saved successfully.',
            $fingerprints,
            [
                'behavior_metrics' => $behaviorMetrics,
                'risk_score' => $behaviorScore['risk_score'],
                'triggered_rules' => $behaviorScore['triggered_rules'],
                'subnet' => $networkSignals['subnet'],
                'vpn_detected' => $networkSignals['vpn_detected'],
                'proxy_detected' => $networkSignals['proxy_detected'],
                'hosting_detected' => $networkSignals['hosting_detected'],
                'rate_limited' => false,
                'network_monitoring' => $networkSignals,
            ]
        );

        return [
            'status' => 200,
            'message' => 'Thank you! Your vote has been received.',
        ];
    }

    private function blocked(
        Request $request,
        Nominee $nominee,
        array $validated,
        string $message,
        int $status,
        string $reason,
        array $meta = [],
        array $fingerprints = [],
        string $logStatus = 'blocked'
    ): array {
        $this->attemptLogger->log($request, $nominee, $validated, $logStatus, $reason, $fingerprints, $meta);

        return [
            'status' => $status,
            'message' => $message,
        ];
    }

    private function checkRateLimit(Request $request): array
    {
        $key = 'vote-rate-limit:' . sha1((string) $request->ip());
        $maxAttempts = (int) config('voting.rate_limit_attempts', 10);
        $decaySeconds = (int) config('voting.rate_limit_decay_minutes', 10) * 60;

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return [
                'limited' => true,
                'attempts' => RateLimiter::attempts($key),
                'available_in' => RateLimiter::availableIn($key),
            ];
        }

        RateLimiter::hit($key, $decaySeconds);

        return [
            'limited' => false,
            'attempts' => RateLimiter::attempts($key),
            'available_in' => RateLimiter::availableIn($key),
        ];
    }

    private function isLikelyBotUserAgent(?string $userAgent): bool
    {
        if (empty($userAgent)) {
            return true;
        }

        foreach (config('voting.bot_user_agent_patterns', []) as $pattern) {
            if (@preg_match($pattern, $userAgent) === 1) {
                return true;
            }
        }

        return false;
    }

    private function generateFingerprints(Request $request, array $validated): array
    {
        $backendFingerprintSource = ($request->ip() ?? '') . '|' . (string) $request->userAgent();
        $backendFingerprint = hash('sha256', $backendFingerprintSource);

        $multiFactorSource = implode('|', [
            (string) $validated['fingerprint_js'],
            $backendFingerprint,
            (string) $validated['screen_resolution'],
            (string) $validated['timezone'],
            (string) $validated['language'],
        ]);

        return [
            'backend_fingerprint' => $backendFingerprint,
            'multi_factor_hash' => hash('sha256', $multiFactorSource),
        ];
    }
}
