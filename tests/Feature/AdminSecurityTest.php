<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Nominee;
use App\Models\Vote;
use App\Services\Audit\AuditLoggerService;
use App\Services\Voting\VoteIntegrityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    /**
     * Test admin authentication dispatches MFA OTP.
     */
    public function test_admin_login_triggers_mfa_otp(): void
    {
        $admin = AdminUser::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'phone' => '255749562993',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'requires_otp',
                'admin_id' => $admin->id
            ]);

        $this->assertTrue(Cache::has('admin_otp_' . $admin->id));
    }

    /**
     * Test admin OTP verification issues token and creates audit log.
     */
    public function test_admin_mfa_verification_authenticates_session(): void
    {
        $admin = AdminUser::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'phone' => '255749562993',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        Cache::put('admin_otp_' . $admin->id, '123456', now()->addMinutes(5));

        $response = $this->postJson('/api/v1/admin/login/verify', [
            'admin_id' => $admin->id,
            'code' => '123456',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email', 'role']
            ]);

        // Assert audit log was recorded
        $this->assertDatabaseHas('audit_logs', [
            'admin_user_id' => $admin->id,
            'action' => 'ADMIN_LOGIN_SUCCESS',
        ]);

        $log = AuditLog::first();
        $this->assertTrue(AuditLoggerService::verify($log));
    }

    /**
     * Test that admin middleware blocks unauthenticated users.
     */
    public function test_middleware_restricts_unauthorized_access(): void
    {
        $response = $this->getJson('/api/v1/admin/stats');
        $response->assertStatus(401); // Sanctum unauthorized
    }

    public function test_auditor_cannot_mutate_admin_resources(): void
    {
        Sanctum::actingAs($this->createAdmin('auditor'));

        $response = $this->postJson('/api/v1/admin/crud/groups', [
            'name' => 'Clinical Excellence',
            'description' => 'Restricted write action.',
            'status' => 'active',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Access Denied: Insufficient administrative role.',
            ]);
    }

    public function test_super_admin_can_mutate_system_resources(): void
    {
        Sanctum::actingAs($this->createAdmin('super_admin'));

        $response = $this->postJson('/api/v1/admin/crud/groups', [
            'name' => 'Clinical Excellence',
            'description' => 'Core awards group.',
            'status' => 'active',
        ]);

        $response->assertOk()
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseHas('category_groups', [
            'name' => 'Clinical Excellence',
            'status' => 'active',
        ]);
    }

    public function test_content_manager_can_manage_content_but_not_system_categories(): void
    {
        Sanctum::actingAs($this->createAdmin('content_manager'));

        $contentResponse = $this->postJson('/api/v1/admin/content/sponsors', [
            'name' => 'Local Health Partner',
            'tier' => 'gold',
            'description' => 'Supports the awards.',
            'website_url' => 'https://example.com',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $contentResponse->assertOk()
            ->assertJson([
                'status' => 'success',
            ]);

        $categoryResponse = $this->postJson('/api/v1/admin/crud/groups', [
            'name' => 'Restricted Group',
            'description' => 'Should be blocked.',
            'status' => 'active',
        ]);

        $categoryResponse->assertStatus(403);
    }

    public function test_auditor_can_run_vote_integrity_audit_with_service_hashes(): void
    {
        Sanctum::actingAs($this->createAdmin('auditor'));

        $category = Category::create([
            'name' => 'Integrity Category',
            'slug' => 'integrity-category',
            'status' => 'active',
            'voting_enabled' => true,
        ]);

        $nominee = Nominee::create([
            'category_id' => $category->id,
            'name' => 'Integrity Nominee',
            'bio' => 'Audit test nominee.',
            'is_suspended' => false,
            'votes_count' => 0,
        ]);

        $validVote = Vote::create([
            'nominee_id' => $nominee->id,
            'category_id' => $category->id,
            'phone_number' => '0712345678',
            'votes_count' => 3,
        ]);
        (new VoteIntegrityService())->sign($validVote);

        Vote::create([
            'nominee_id' => $nominee->id,
            'category_id' => $category->id,
            'phone_number' => '0798765432',
            'votes_count' => 2,
        ]);

        $response = $this->postJson('/api/v1/admin/votes/verify');

        $response->assertOk()
            ->assertJsonPath('audit.total_audited', 2)
            ->assertJsonPath('audit.valid_votes', 1)
            ->assertJsonPath('audit.tampered_votes', 1)
            ->assertJsonPath('audit.is_compromised', true);
    }
    private function createAdmin(string $role): AdminUser
    {
        return AdminUser::create([
            'name' => ucfirst($role) . ' Admin',
            'email' => $role . '@test.com',
            'phone' => '2557' . random_int(10000000, 99999999),
            'password' => Hash::make('password123'),
            'role' => $role,
            'is_active' => true,
        ]);
    }
}



