<?php

namespace App\Http\Controllers;

use App\Models\Nominee;
use App\Models\Category;
use App\Models\VoteOrder;
use App\Models\Transaction;
use App\Services\OTP\OtpManager;
use App\Services\Payments\PaymentManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    private const VOTE_PACKAGES = [
        1 => 500.0,
        3 => 1000.0,
        6 => 5000.0,
        15 => 10000.0,
        25 => 20000.0,
        55 => 40000.0,
    ];

    public function __construct(
        private readonly OtpManager $otpManager,
        private readonly PaymentManager $paymentManager
    ) {
    }

    /**
     * Get list of available voting packages.
     */
    public function getPackages(): JsonResponse
    {
        $packages = [];
        foreach (self::VOTE_PACKAGES as $votes => $price) {
            $packages[] = [
                'votes' => $votes,
                'price' => $price,
                'label' => "$votes Kura = " . number_format($price) . " TZS"
            ];
        }

        return response()->json([
            'status' => 'success',
            'packages' => $packages
        ]);
    }

    /**
     * Request OTP to authenticate voter phone number.
     */
    public function requestOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^(?:255|0)[67]\d{8}$/'],
            'channel' => 'required|string|in:sms,whatsapp',
        ]);

        $phone = $request->input('phone');
        $channel = $request->input('channel');

        // Generate 6 digit OTP
        $otp = (string) rand(100000, 999999);
        
        // Save in Cache for 5 minutes
        $cacheKey = 'otp_' . $phone;
        Cache::put($cacheKey, $otp, now()->addMinutes(5));

        Log::info("OTP generated for $phone: $otp");

        // Send OTP using OtpManager (resolves active driver)
        $sent = $this->otpManager->driver()->send($phone, $otp, $channel);

        if (!$sent) {
            return response()->json([
                'status' => 'error',
                'message' => 'Imeshindwa kutuma namba ya siri. Tafadhali jaribu tena baadae.'
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Namba ya siri (OTP) imetumwa kwenye simu yako.'
        ]);
    }

    /**
     * Verify OTP and return voter session token.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^(?:255|0)[67]\d{8}$/'],
            'code' => 'required|string|size:6',
        ]);

        $phone = $request->input('phone');
        $code = $request->input('code');

        $cacheKey = 'otp_' . $phone;
        $savedOtp = Cache::get($cacheKey);

        // Fallback for testing/sandbox
        $isMockTest = (config('otp.default') === 'log' && $code === '123456');

        if (($savedOtp && $savedOtp === $code) || $isMockTest) {
            // Remove OTP from cache
            Cache::forget($cacheKey);

            // Generate voter token
            $token = 'voter_' . Str::random(40);
            
            // Store voter session in cache for 30 minutes
            Cache::put($token, $phone, now()->addMinutes(30));

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'phone' => $phone,
                'message' => 'Uthibitishaji umefanikiwa.'
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Namba ya siri uliyoweka sio sahihi au imepitwa na wakati.'
        ], 422);
    }

    /**
     * Initiate paid voting checkout (USSD Push).
     */
    public function initiatePaidVote(Request $request): JsonResponse
    {
        $request->validate([
            'nominee_id' => 'required|uuid|exists:nominees,id',
            'votes_count' => 'required|integer|in:' . implode(',', array_keys(self::VOTE_PACKAGES)),
            'phone_provider' => 'required|string|in:mpesa,tigopesa,airtelmoney,halopesa',
            'payment_phone' => ['required', 'string', 'regex:/^(?:255|0)[67]\d{8}$/'],
            'voter_token' => 'required|string',
        ]);

        $voterToken = $request->input('voter_token');
        $verifiedPhone = Cache::get($voterToken);

        if (!$verifiedPhone) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kipindi chako cha uthibitisho kimeisha. Tafadhali jithibitishe tena.'
            ], 401);
        }

        $nominee = Nominee::findOrFail($request->input('nominee_id'));
        $nominee->loadMissing('category');

        // Check if voting is active
        if ($nominee->is_suspended) {
            return response()->json(['status' => 'error', 'message' => 'Mshiriki huyu amesimamishwa kwa sasa.'], 403);
        }

        if (!$nominee->category || $nominee->category->status !== 'active') {
            return response()->json(['status' => 'error', 'message' => 'Kategoria hii haijafunguliwa kwa sasa.'], 403);
        }

        $votesCount = (int) $request->input('votes_count');
        $expectedAmount = self::VOTE_PACKAGES[$votesCount];

        // Create Vote Order
        $order = VoteOrder::create([
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'phone_number' => $verifiedPhone,
            'votes_count' => $votesCount,
            'amount' => $expectedAmount,
            'status' => VoteOrder::STATUS_PENDING,
        ]);

        // Create Transaction record
        $transaction = Transaction::create([
            'order_id' => (string) Str::uuid(),
            'payable_id' => $order->id,
            'payable_type' => VoteOrder::class,
            'amount' => $expectedAmount,
            'currency' => 'TZS',
            'status' => Transaction::STATUS_PENDING,
            'payment_method' => strtoupper($request->input('phone_provider')),
            'phone_number' => $request->input('payment_phone'),
            'notes' => 'Kura za malipo kwa ajili ya mshiriki: ' . $nominee->name,
        ]);

        // Initiate payment gateway driver
        $paymentResult = $this->paymentManager->driver()->initiate(
            $transaction, 
            $request->input('payment_phone'), 
            $request->input('phone_provider')
        );

        if (!$paymentResult) {
            $order->update(['status' => VoteOrder::STATUS_FAILED]);
            $transaction->update(['status' => Transaction::STATUS_FAILED, 'notes' => 'Uanzishaji wa malipo umeshindikana kwenye Gateway']);
            return response()->json([
                'status' => 'error',
                'message' => 'Imeshindwa kuanzisha muamala wa malipo. Tafadhali jaribu tena.'
            ], 500);
        }

        // Return order ID and transaction details
        return response()->json([
            'status' => 'success',
            'order_id' => $order->id,
            'transaction_id' => $transaction->id,
            'message' => 'Ombi la malipo limetengenezwa. Tafadhali weka PIN kwenye simu yako kukamilisha malipo.'
        ]);
    }

    /**
     * Check current status of a vote order.
     */
    public function checkOrderStatus(VoteOrder $order): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'order_id' => $order->id,
            'payment_status' => $order->status,
        ]);
    }
}
