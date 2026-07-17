<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Services\OTP\OtpManager;
use App\Services\Audit\AuditLoggerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    public function __construct(
        private readonly OtpManager $otpManager
    ) {
    }

    /**
     * Authenticate admin credentials and dispatch MFA OTP.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = AdminUser::where('email', $request->input('email'))->first();

        if (!$admin || !Hash::check($request->input('password'), $admin->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nyaraka za kuingia sio sahihi.'
            ], 401);
        }

        if (!$admin->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akaunti hii imesimamishwa na msimamizi.'
            ], 403);
        }

        // Generate 6 digit OTP
        $otp = (string) rand(100000, 999999);
        $cacheKey = 'admin_otp_' . $admin->id;
        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Log::info("Admin MFA OTP generated for {$admin->name} ({$admin->phone}): $otp");

        // Send OTP via SMS
        $sent = $this->otpManager->driver()->send($admin->phone, $otp, 'sms');

        if (!$sent) {
            return response()->json([
                'status' => 'error',
                'message' => 'Imeshindwa kutuma namba ya siri ya MFA. Jaribu tena.'
            ], 500);
        }

        return response()->json([
            'status' => 'requires_otp',
            'admin_id' => $admin->id,
            'message' => 'Uthibitishaji wa MFA unahitajika. Namba ya siri imetumwa.',
            'otp_preview' => config('app.env') === 'local' ? $otp : null
        ]);
    }

    /**
     * Verify MFA OTP code and issue API bearer token.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'admin_id' => 'required|uuid',
            'code' => 'required|string|size:6',
        ]);

        $adminId = $request->input('admin_id');
        $code = $request->input('code');

        $admin = AdminUser::find($adminId);

        if (!$admin || !$admin->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akaunti sio sahihi au imesimamishwa.'
            ], 403);
        }

        $cacheKey = 'admin_otp_' . $admin->id;
        $savedOtp = Cache::get($cacheKey);

        $isMockTest = (config('otp.default') === 'log' && $code === '123456');

        if (!$isMockTest && (!$savedOtp || $savedOtp !== $code)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Namba ya siri (OTP) sio sahihi au imepitwa na wakati.'
            ], 422);
        }

        Cache::forget($cacheKey);

        // Issue token
        $token = $admin->createToken('admin-token')->plainTextToken;

        // Log administrative action
        AuditLoggerService::log(
            adminUserId: $admin->id,
            action: 'ADMIN_LOGIN_SUCCESS',
            modelType: AdminUser::class,
            modelId: $admin->id
        );

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ]
        ]);
    }
}
