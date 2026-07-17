<?php

namespace App\Services\Voting;

use App\Models\Vote;
use Illuminate\Support\Facades\Log;

class VoteIntegrityService
{
    /**
     * Generate the cryptographic signature for a vote.
     *
     * @param Vote $vote
     * @return string
     */
    public function generateHash(Vote $vote): string
    {
        $timestamp = $vote->voted_at ?? $vote->created_at;

        // Concatenate key fields that must not be altered
        $data = implode('|', [
            (string) $vote->id,
            (string) $vote->nominee_id,
            (string) $vote->category_id,
            (string) $vote->transaction_id,
            (string) $vote->phone_number,
            (int) $vote->votes_count,
            $timestamp ? $timestamp->toIso8601String() : '',
        ]);

        // Generate HMAC-SHA256 signature using APP_KEY as secret
        return hash_hmac('sha256', $data, config('app.key'));
    }

    /**
     * Sign the vote and update its integrity hash.
     *
     * @param Vote $vote
     * @return bool
     */
    public function sign(Vote $vote): bool
    {
        if (!$vote->voted_at) {
            $vote->voted_at = now();
        }

        $vote->integrity_hash = $this->generateHash($vote);
        return $vote->save();
    }

    /**
     * Verify that a vote has not been tampered with.
     *
     * @param Vote $vote
     * @return bool
     */
    public function verify(Vote $vote): bool
    {
        if (empty($vote->integrity_hash)) {
            Log::warning("Vote verification failed: No integrity hash for Vote ID: {$vote->id}");
            return false;
        }

        $calculated = $this->generateHash($vote);
        $isValid = hash_equals($calculated, $vote->integrity_hash);

        if (!$isValid) {
            Log::alert("SECURITY ALERT: Vote tampering detected for Vote ID: {$vote->id}. Expected: {$calculated}, Found: {$vote->integrity_hash}");
        }

        return $isValid;
    }
}
