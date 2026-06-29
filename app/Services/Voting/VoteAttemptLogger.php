<?php

namespace App\Services\Voting;

use App\Models\Nominee;
use App\Models\VoteAttemptLog;
use Illuminate\Http\Request;

class VoteAttemptLogger
{
    public function log(
        Request $request,
        Nominee $nominee,
        array $validated,
        string $status,
        ?string $reason = null,
        array $fingerprints = [],
        array $meta = []
    ): VoteAttemptLog {
        return VoteAttemptLog::create([
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'status' => $status,
            'reason' => $reason,
            'ip_address' => $request->ip(),
            'subnet' => $meta['subnet'] ?? null,
            'vpn_detected' => $meta['vpn_detected'] ?? false,
            'user_agent' => $request->userAgent(),
            'fingerprint_js' => $validated['fingerprint_js'] ?? null,
            'screen_resolution' => $validated['screen_resolution'] ?? null,
            'timezone' => $validated['timezone'] ?? null,
            'language' => $validated['language'] ?? null,
            'page_time_seconds' => $validated['page_time_seconds'] ?? null,
            'mouse_move_count' => $validated['mouse_move_count'] ?? null,
            'scroll_count' => $validated['scroll_count'] ?? null,
            'focus_count' => $validated['focus_count'] ?? null,
            'blur_count' => $validated['blur_count'] ?? null,
            'multi_factor_hash' => $fingerprints['multi_factor_hash'] ?? null,
            'risk_score' => $meta['risk_score'] ?? null,
            'proxy_detected' => $meta['proxy_detected'] ?? false,
            'hosting_detected' => $meta['hosting_detected'] ?? false,
            'rate_limited' => $meta['rate_limited'] ?? false,
            'behavior_metrics' => $meta['behavior_metrics'] ?? null,
            'asn_name' => $meta['asn_name'] ?? null,
            'asn_detected' => $meta['asn_detected'] ?? false,
            'meta' => $meta ?: null,
            'attempted_at' => now(),
        ]);
    }
}
