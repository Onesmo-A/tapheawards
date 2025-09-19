<?php

namespace App\Policies;

use App\Models\NomineeApplication;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class NomineeApplicationPolicy
{
    /**
     * Determine whether the user can create a new nominee application.
     *
     * Hii inazuia mtumiaji kuanza ombi jipya kama tayari ana ombi
     * ambalo bado liko kwenye mchakato (linasubiri malipo, review, n.k).
     */
    public function create(User $user): Response
    {
        // Angalia kama mtumiaji ana ombi lolote ambalo status yake ni 'pending...'
        $hasPendingApplication = $user->nomineeApplications()
            ->whereIn('status', ['pending_payment', 'payment_failed', 'pending_review'])
            ->exists();

        // Kama ana ombi linaloendelea, mzuie.
        return $hasPendingApplication
            ? Response::deny('Tayari una ombi ambalo linaendelea. Tafadhali kamilisha au subiri lijibiwe kabla ya kuanzisha jipya.')
            : Response::allow();
    }

    /**
     * Determine whether the user can view the model.
     * Hii inahakikisha mtumiaji anaweza kuona maombi yake pekee.
     */
    public function view(User $user, NomineeApplication $application): bool
    {
        return $user->id === $application->user_id;
    }

    /**
     * Determine whether the user can retry payment for the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\NomineeApplication  $nomineeApplication
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function retryPayment(User $user, NomineeApplication $nomineeApplication)
    {
        return $user->id === $nomineeApplication->user_id;
    }
}
