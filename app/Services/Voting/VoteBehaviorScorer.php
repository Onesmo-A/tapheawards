<?php

namespace App\Services\Voting;

class VoteBehaviorScorer
{
    public function normalize(array $payload): array
    {
        return [
            'page_time_seconds' => (int) ($payload['page_time_seconds'] ?? 0),
            'mouse_move_count' => (int) ($payload['mouse_move_count'] ?? 0),
            'scroll_count' => (int) ($payload['scroll_count'] ?? 0),
            'focus_count' => (int) ($payload['focus_count'] ?? 0),
            'blur_count' => (int) ($payload['blur_count'] ?? 0),
        ];
    }

    /**
     * Score the behavior payload.
     *
     * Short page dwell time or zero interaction signals are often associated
     * with automation, but we keep the threshold configurable to avoid
     * over-blocking fast legitimate voters on reliable connections.
     */
    public function score(array $metrics): array
    {
        $minimumPageTime = (int) config('voting.minimum_page_time_seconds', 3);
        $threshold = (int) config('voting.behavioral_risk_threshold', 80);

        $score = 0;
        $triggeredRules = [];

        // Only penalize extremely low interaction and very short page dwell time.
        // This prevents legitimate voters from being blocked for normal fast use or
        // minimal mobile interaction.
        if (($metrics['page_time_seconds'] ?? 0) < $minimumPageTime) {
            $score += 25;
            $triggeredRules[] = 'page_time_seconds_below_minimum';
        }

        if (($metrics['mouse_move_count'] ?? 0) === 0) {
            $score += 20;
            $triggeredRules[] = 'mouse_move_count_zero';
        }

        if (($metrics['scroll_count'] ?? 0) === 0) {
            $score += 15;
            $triggeredRules[] = 'scroll_count_zero';
        }

        if (($metrics['focus_count'] ?? 0) === 0) {
            $score += 10;
            $triggeredRules[] = 'focus_count_zero';
        }

        if (($metrics['blur_count'] ?? 0) === 0) {
            $score += 5;
            $triggeredRules[] = 'blur_count_zero';
        }

        return [
            'risk_score' => $score,
            'threshold' => $threshold,
            'blocked' => $score >= $threshold,
            'triggered_rules' => $triggeredRules,
        ];
    }
}
