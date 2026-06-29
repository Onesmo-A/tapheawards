<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitVoteRequest;
use App\Models\Nominee;
use App\Services\Voting\VoteSubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Voting\VoteSessionService;

class VoteController extends Controller
{
    public function __construct(
        private readonly VoteSubmissionService $voteSubmissionService,
    ) {
    }

    /**
     * Store a vote while keeping the controller thin.
     */
    public function store(SubmitVoteRequest $request, Nominee $nominee): JsonResponse
    {
        $result = $this->voteSubmissionService->submit($nominee, $request, $request->validated());

        return response()->json([
            'message' => $result['message'],
        ], $result['status']);
    }

    public function voteSession(Request $request, Nominee $nominee, VoteSessionService $voteSessionService): JsonResponse
    {
        return response()->json($voteSessionService->issue($nominee, $request));
    }
}
