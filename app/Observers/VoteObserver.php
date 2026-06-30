<?php

namespace App\Observers;

use App\Models\Vote;

/**
 * Handles events for the Vote model.
 * This ensures that the votes_count on the Nominee model is always in sync.
 */
class VoteObserver
{
    /**
     * Handle the Vote "created" event.
     *
     * @param  \App\Models\Vote  $vote
     * @return void
     */
    public function created(Vote $vote): void
    {
        // Kura mpya ikitengenezwa, ongeza hesabu ya kura kwenye mshiriki husika kwa thamani ya votes_count.
        $vote->nominee()->increment('votes_count', $vote->votes_count ?? 1);
    }

    /**
     * Handle the Vote "deleted" event.
     *
     * @param  \App\Models\Vote  $vote
     * @return void
     */
    public function deleted(Vote $vote): void
    {
        // Kura ikifutwa, punguza hesabu. Hii ni muhimu kwa usahihi wa data.
        $vote->nominee()->decrement('votes_count', $vote->votes_count ?? 1);
    }
}