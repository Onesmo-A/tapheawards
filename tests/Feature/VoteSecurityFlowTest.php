<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Nominee;
use App\Models\Vote;
use App\Services\Voting\VoteSessionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use App\Services\Voting\VoteSessionException;
use Tests\TestCase;

class VoteSecurityFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        config([
            'services.ip_check.url' => null,
            'voting.rate_limit_attempts' => 100,
            'voting.rate_limit_decay_minutes' => 10,
            'voting.vote_session_minutes' => 10,
            'voting.vote_nonce_minutes' => 10,
        ]);

        Cache::flush();
    }

    public function test_vote_session_token_is_one_time_use(): void
    {
        $nominee = $this->createNominee();
        $service = app(VoteSessionService::class);

        $issued = $service->issue($nominee);

        $payload = $service->consume($nominee, $issued['vote_session_token']);

        $this->assertSame($nominee->id, $payload['nominee_id']);
        $this->assertArrayHasKey('jti', $payload);

        $this->expectException(VoteSessionException::class);
        $service->consume($nominee, $issued['vote_session_token']);
    }

    public function test_vote_submission_creates_vote_with_valid_security_proofs(): void
    {
        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => true,
                'challenge_ts' => now()->toIso8601String(),
                'hostname' => 'localhost',
                'error-codes' => [],
            ], 200),
        ]);

        $nominee = $this->createNominee();
        $session = app(VoteSessionService::class)->issue($nominee);

        $response = $this->postJson(route('nominees.vote', $nominee), [
            'fingerprint_js' => 'fp-test-visitor-12345',
            'screen_resolution' => '1920x1080',
            'timezone' => 'Africa/Nairobi',
            'language' => 'en-US',
            'vote_session_token' => $session['vote_session_token'],
            'vote_nonce' => 'nonce-' . str()->random(16),
            'page_time_seconds' => 8,
            'mouse_move_count' => 3,
            'scroll_count' => 2,
            'focus_count' => 1,
            'blur_count' => 0,
        ], [
            'User-Agent' => 'Mozilla/5.0',
        ]);

        $response->assertOk();
        $this->assertDatabaseCount('votes', 1);
        $this->assertDatabaseHas('votes', [
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'fingerprint_js' => 'fp-test-visitor-12345',
        ]);
    }

    public function test_vote_submission_rejects_reused_vote_session_token(): void
    {
        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => true,
                'challenge_ts' => now()->toIso8601String(),
                'hostname' => 'localhost',
                'error-codes' => [],
            ], 200),
        ]);

        $nominee = $this->createNominee();
        $service = app(VoteSessionService::class);
        $session = $service->issue($nominee);

        $payload = [
            'fingerprint_js' => 'fp-test-visitor-12345',
            'screen_resolution' => '1920x1080',
            'timezone' => 'Africa/Nairobi',
            'language' => 'en-US',
            'vote_session_token' => $session['vote_session_token'],
            'vote_nonce' => 'nonce-' . str()->random(16),
            'page_time_seconds' => 8,
            'mouse_move_count' => 3,
            'scroll_count' => 2,
            'focus_count' => 1,
            'blur_count' => 0,
        ];

        $first = $this->postJson(route('nominees.vote', $nominee), $payload, [
            'User-Agent' => 'Mozilla/5.0',
        ]);
        $first->assertOk();

        $sessionAgain = $service->issue($nominee);
        $payload['vote_session_token'] = $sessionAgain['vote_session_token'];

        $second = $this->postJson(route('nominees.vote', $nominee), $payload, [
            'User-Agent' => 'Mozilla/5.0',
        ]);

        $second->assertStatus(403);
    }

    private function createNominee(): Nominee
    {
        $category = Category::query()->create([
            'name' => 'Best Artist',
            'slug' => 'best-artist-' . str()->random(6),
            'description' => 'Voting category',
            'status' => 'active',
            'voting_enabled' => true,
        ]);

        return Nominee::query()->create([
            'category_id' => $category->id,
            'name' => 'Nominee ' . str()->random(6),
            'bio' => 'Test nominee',
            'is_suspended' => false,
        ]);
    }
}
