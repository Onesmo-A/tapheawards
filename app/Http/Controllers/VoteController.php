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
        try {
            $packages = \App\Models\VotePackage::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('votes')
                ->get()
                ->map(function ($pkg) {
                    return [
                        'votes' => $pkg->votes,
                        'price' => $pkg->price,
                        'label' => $pkg->label,
                        'sub' => $pkg->sub
                    ];
                });
            
            if ($packages->isEmpty()) {
                $packages = collect(self::VOTE_PACKAGES)->map(function ($price, $votes) {
                    return [
                        'votes' => $votes,
                        'price' => $price,
                        'label' => "$votes Vote" . ($votes > 1 ? 's' : ''),
                        'sub' => $votes === 1 ? 'Single test vote' : "$votes Votes Package"
                    ];
                })->values();
            }
        } catch (\Exception $e) {
            $packages = collect(self::VOTE_PACKAGES)->map(function ($price, $votes) {
                return [
                    'votes' => $votes,
                    'price' => $price,
                    'label' => "$votes Vote" . ($votes > 1 ? 's' : ''),
                    'sub' => $votes === 1 ? 'Single test vote' : "$votes Votes Package"
                ];
            })->values();
        }

        return response()->json([
            'status' => 'success',
            'packages' => $packages
        ]);
    }

    /**
     * Get Proof-of-Work challenge for OTP request.
     */
    public function getChallenge(Request $request): JsonResponse
    {
        $ip = $request->ip();
        $challenge = Str::random(32);
        
        // Cache the challenge for this IP for 10 minutes
        Cache::put('pow_challenge_' . $ip, $challenge, now()->addMinutes(10));
        
        return response()->json([
            'status' => 'success',
            'challenge' => $challenge,
            'difficulty' => 4, // Number of leading zeros required
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
            'pow_nonce' => 'required|string',
            'challenge' => 'required|string',
        ]);

        $phone = $request->input('phone');
        $channel = $request->input('channel');
        $powNonce = $request->input('pow_nonce');
        $clientChallenge = $request->input('challenge');
        $ip = $request->ip();

        // 1. Verify Challenge
        $cachedChallenge = Cache::get('pow_challenge_' . $ip);
        if (!$cachedChallenge || $cachedChallenge !== $clientChallenge) {
            return response()->json([
                'status' => 'error',
                'message' => 'Challenge imepitwa na wakati au si halali. Tafadhali pakia upya ukurasa.'
            ], 422);
        }

        // 2. Verify Proof of Work (SHA-256 starts with 4 zeros)
        $hash = hash('sha256', $clientChallenge . $powNonce);
        if (!str_starts_with($hash, '0000')) {
            Log::warning("Proof of work failed for IP: $ip, Phone: $phone");
            return response()->json([
                'status' => 'error',
                'message' => 'Uthibitishaji wa usalama (Proof of Work) umeshindikana. Inaonekana ombi hili limetengenezwa na mfumo wa roboti.'
            ], 422);
        }

        // 3. Phone rate limit (max 3 OTP requests per phone per hour)
        $phoneLimitKey = 'otp_limit_phone_' . $phone;
        $phoneRequests = (int) Cache::get($phoneLimitKey, 0);
        if ($phoneRequests >= 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Namba hii imezidi kikomo cha maombi ya OTP kwa saa hii. Tafadhali jaribu tena baadae.'
            ], 429);
        }

        // 4. IP rate limit (max 10 OTP requests per IP per hour)
        $ipLimitKey = 'otp_limit_ip_' . $ip;
        $ipRequests = (int) Cache::get($ipLimitKey, 0);
        if ($ipRequests >= 10) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mtandao wako umezidi kikomo cha maombi ya OTP kwa saa hii. Tafadhali jaribu tena baadae.'
            ], 429);
        }

        // Increment rate limits
        Cache::put($phoneLimitKey, $phoneRequests + 1, now()->addHour());
        Cache::put($ipLimitKey, $ipRequests + 1, now()->addHour());

        // Consume challenge
        Cache::forget('pow_challenge_' . $ip);

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
            'message' => 'Your OTP is Expired'
        ], 422);
    }

    /**
     * Initiate paid voting checkout (USSD Push).
     */
    public function initiatePaidVote(Request $request): JsonResponse
    {
        try {
            $dbPackages = \App\Models\VotePackage::where('is_active', true)->pluck('price', 'votes')->toArray();
        } catch (\Exception $e) {
            $dbPackages = [];
        }

        $packages = !empty($dbPackages) ? $dbPackages : self::VOTE_PACKAGES;
        $allowedVoteCounts = array_keys($packages);

        $request->validate([
            'nominee_id' => 'required|uuid|exists:nominees,id',
            'votes_count' => 'required|integer|in:' . implode(',', $allowedVoteCounts),
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
        $expectedAmount = $packages[$votesCount];

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
            'vote_order_id' => $order->id,
            'transaction_id' => $transaction->id,
            'transaction_order_id' => $transaction->order_id,
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

