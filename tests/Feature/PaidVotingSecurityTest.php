<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Nominee;
use App\Models\Vote;
use App\Models\VoteOrder;
use App\Models\Transaction;
use App\Services\Voting\VoteIntegrityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PaidVotingSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        Cache::flush();
        
        // Mock application key for HMAC consistency
        config(['app.key' => 'base64:w45M9L7pUqN+Q4uG3lQfK25s/L2kQ1+8561l567w12o=']);

        // Allow localhost for ZenoPay webhook simulation
        config(['services.zenopay.ips' => '127.0.0.1']);
    }

    public function test_voter_phone_number_otp_lifecycle_works(): void
    {
        // 1. Request OTP
        $response = $this->postJson(route('api.vote.otp.request'), [
            'phone' => '0712345678',
            'channel' => 'sms',
        ]);

        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'message' => 'Namba ya siri (OTP) imetumwa kwenye simu yako.'
        ]);

        $otp = Cache::get('otp_0712345678');
        $this->assertNotNull($otp);

        // 2. Verify wrong OTP code fails
        $failVerify = $this->postJson(route('api.vote.otp.verify'), [
            'phone' => '0712345678',
            'code' => '000000',
        ]);
        $failVerify->assertStatus(422);

        // 3. Verify correct OTP works and returns token
        $successVerify = $this->postJson(route('api.vote.otp.verify'), [
            'phone' => '0712345678',
            'code' => $otp,
        ]);

        $successVerify->assertOk();
        $successVerify->assertJsonStructure(['status', 'token', 'phone']);
        
        $token = $successVerify->json('token');
        $this->assertSame('0712345678', Cache::get($token));
    }

    public function test_vote_initiation_fails_without_valid_voter_token(): void
    {
        $nominee = $this->createNominee();

        $response = $this->postJson(route('api.vote.initiate'), [
            'nominee_id' => $nominee->id,
            'votes_count' => 3,
            'phone_provider' => 'mpesa',
            'payment_phone' => '0712345678',
            'voter_token' => 'invalid-token-12345',
        ]);

        $response->assertStatus(401);
    }

    public function test_vote_initiation_succeeds_with_valid_voter_token(): void
    {
        $nominee = $this->createNominee();
        
        // Authenticate voter
        $voterToken = 'voter_test_token_999';
        Cache::put($voterToken, '0712345678', 30);

        // Request paid voting initiation
        $response = $this->postJson(route('api.vote.initiate'), [
            'nominee_id' => $nominee->id,
            'votes_count' => 15,
            'phone_provider' => 'mpesa',
            'payment_phone' => '0712345678',
            'voter_token' => $voterToken,
        ]);

        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'message' => 'Ombi la malipo limetengenezwa. Tafadhali weka PIN kwenye simu yako kukamilisha malipo.'
        ]);

        // Verify database entry
        $this->assertDatabaseHas('vote_orders', [
            'nominee_id' => $nominee->id,
            'votes_count' => 15,
            'amount' => 10000.00,
            'status' => 'pending'
        ]);

        $this->assertDatabaseHas('transactions', [
            'amount' => 10000.00,
            'status' => 'pending',
            'payment_method' => 'MPESA'
        ]);
    }

    public function test_webhook_successfully_casts_signed_vote_and_increments_count(): void
    {
        $nominee = $this->createNominee();
        
        $order = VoteOrder::create([
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'phone_number' => '0712345678',
            'votes_count' => 6,
            'amount' => 5000.00,
            'status' => 'pending',
        ]);

        $transaction = Transaction::create([
            'order_id' => (string) \Illuminate\Support\Str::uuid(),
            'payable_id' => $order->id,
            'payable_type' => VoteOrder::class,
            'amount' => 5000.00,
            'currency' => 'TZS',
            'status' => 'pending',
            'phone_number' => '0712345678',
        ]);

        // Verify nominee has 0 votes starting
        $this->assertEquals(0, $nominee->fresh()->votes_count);

        // Call our internal webhook transaction processor
        // We will test using ZenoPay webhook simulation
        $response = $this->postJson(route('api.webhooks.zenopay'), [
            'order_id' => $transaction->order_id,
            'payment_status' => 'COMPLETED',
            'reference' => 'TXN-99999-OK',
            'channel' => 'MPESA',
        ]);

        $response->assertOk();

        // 1. Verify transaction and order are completed
        $this->assertEquals('completed', $transaction->fresh()->status);
        $this->assertEquals('completed', $order->fresh()->status);

        // 2. Verify vote was cast with the correct count
        $this->assertDatabaseHas('votes', [
            'nominee_id' => $nominee->id,
            'votes_count' => 6,
            'phone_number' => '0712345678',
        ]);

        // 3. Verify nominee votes count is incremented by 6!
        $this->assertEquals(6, $nominee->fresh()->votes_count);

        // 4. Verify cryptographic signature was generated and is valid
        $vote = Vote::where('nominee_id', $nominee->id)->first();
        $this->assertNotNull($vote->integrity_hash);

        $integrityService = new VoteIntegrityService();
        $this->assertTrue($integrityService->verify($vote));

        // 5. Verify database tampering gets caught
        $vote->votes_count = 100; // Alter vote count manually (simulation of database hacking)
        $this->assertFalse($integrityService->verify($vote));
    }

    private function createNominee(): Nominee
    {
        $category = Category::query()->create([
            'name' => 'Best Digital Health Specialist',
            'slug' => 'best-digital-health',
            'description' => 'Category description',
            'status' => 'active',
            'voting_enabled' => true,
        ]);

        return Nominee::query()->create([
            'category_id' => $category->id,
            'name' => 'Dr. Onesmo A.',
            'bio' => 'A dedicated health tech innovator.',
            'is_suspended' => false,
            'votes_count' => 0,
        ]);
    }
}
