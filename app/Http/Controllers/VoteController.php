<?php

namespace App\Http\Controllers;

use App\Models\Nominee;
use App\Models\Setting;
use App\Models\Vote;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

     /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request, Nominee $nominee)
{
    // 1. Validate the request with custom English messages.
    $validated = $request->validate([
        'fingerprint_js' => 'required|string|min:10',
        'screen_resolution' => 'required|string',
        'timezone' => 'required|string',
        'language' => 'required|string',
    ], [
        'fingerprint_js.required' => 'A technical issue occurred, please try again (FP-JS).',
        'fingerprint_js.min' => 'A technical issue occurred, please try again (FP-JS-MIN).',
        'screen_resolution.required' => 'A technical issue occurred, please try again (SCR).',
        'timezone.required' => 'A technical issue occurred, please try again (TZ).',
        'language.required' => 'A technical issue occurred, please try again (LANG).',
    ]);
    // --- VOTE CONTROL LOGIC ---
    $settings = Cache::remember('app_settings', 3600, function () {
        return Setting::all()->pluck('value', 'key');
    });

    // 1. Check if voting is disabled
    if (! (bool) $settings->get('voting_active', true)) {
        return response()->json(['message' => 'Sorry, voting is currently disabled.'], 403);
    }

    // 2. Check if the voting deadline has passed
    $deadline = $settings->get('voting_deadline');
    if ($deadline && Carbon::now()->isAfter(Carbon::parse($deadline))) {
        return response()->json(['message' => 'Sorry, the voting period has ended.'], 403);
    }

    // 3. Check if the IP is fraudulent (VPN/Proxy)
    if ($this->isFraudulentIp($request->ip())) {
        return response()->json(['message' => 'The use of VPN or Proxy is not allowed.'], 403);
    }

    // 4. Tengeneza Fingerprints na Multi-Factor Hash kwa kutumia private method
    $fingerprints = $this->generateFingerprints($request, $validated);

    // 5. Kagua kama mtumiaji ameshapiga kura kwenye kategoria hii.
    // KWA MAJARIBIO: Tunatumia 'fingerprint_js' pekee kama kigezo cha kipekee.
    // Hapo awali tulikuwa tunatumia 'multi_factor_hash'.
    $alreadyVoted = Vote::where('category_id', $nominee->category_id)
        ->where('fingerprint_js', $validated['fingerprint_js'])
        ->exists();

    if ($alreadyVoted) {
        return response()->json(['message' => 'You have already voted in this category.'], 429);
    }

    // --- SAVE VOTE ---
    try {
        DB::transaction(function () use ($request, $nominee, $validated, $fingerprints) {
            $nominee->votes()->create([
                'category_id' => $nominee->category_id, // MUHIMU: Hifadhi category_id
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'fingerprint' => $fingerprints['backend_fingerprint'], // Hifadhi backend fingerprint
                'fingerprint_js' => $validated['fingerprint_js'],
                'screen_resolution' => $validated['screen_resolution'],
                'timezone' => $validated['timezone'],
                'language' => $validated['language'],
                'multi_factor_hash' => $fingerprints['multi_factor_hash'],
                'voted_at' => now(),
            ]);
        });
    } catch (\Illuminate\Database\QueryException $e) {
        // Hii inashughulikia kosa la 'duplicate entry' kama kinga ya ziada
        if ($e->errorInfo[1] == 1062) {
            return response()->json(['message' => 'You have already voted in this category.'], 429);
        }
        Log::error('Vote creation DB error for nominee ' . $nominee->id, ['error' => $e->getMessage(), 'ip' => $request->ip()]);
        return response()->json(['message' => 'Server error, please try again later.'], 500);
    }

    // --- SUCCESS RESPONSE ---
    return response()->json([
        'message' => 'Thank you! Your vote has been received.',
    ], 200);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Kagua kama IP address ni ya udanganyifu (VPN, Proxy, Hosting).
     * Inatumia API ya bure ya ip-api.com
     * @param string $ip
     * @return bool
     */
    private function isFraudulentIp(string $ip): bool
    {
        // Usikague IP za ndani (localhost) au anwani za IP za kibinafsi.
        if (in_array($ip, ['127.0.0.1', '::1']) || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return false;
        }

        // Pata URL na vigezo kutoka kwenye config file kwa usalama na urahisi wa kubadilisha.
        $apiUrl = config('services.ip_check.url');
        $apiFields = config('services.ip_check.fields');

        if (!$apiUrl) {
            Log::warning('IP Check API URL is not configured in services.php.');
            return false; // Kama huduma haijawekwa, usizuie kura.
        }

        try {
            $response = Http::timeout(3)->get("{$apiUrl}/{$ip}?fields={$apiFields}");

            if ($response->successful() && $response->json('status') === 'success') {
                return (bool) $response->json('proxy') || (bool) $response->json('hosting');
            }
        } catch (\Exception $e) {
            Log::warning('IP check failed for ' . $ip, ['error' => $e->getMessage()]);
        }
        return false; // Kama API imefeli, ruhusu kura ipite ili isizuie watumiaji halali
    }

    /**
     * Tengeneza fingerprints za kipekee kwa ajili ya kudhibiti upigaji kura.
     *
     * @param Request $request
     * @param array $validatedData
     * @return array
     */
    private function generateFingerprints(Request $request, array $validatedData): array
    {
        // Backend Fingerprint (IP + User Agent) - Tumia sha256 kwa uwiano
        $backendFingerprintSource = $request->ip() . $request->header('User-Agent');
        $backendFingerprint = hash('sha256', $backendFingerprintSource);

        // Multi-Factor Hash (inachanganya data zote kwa usalama zaidi)
        $combinedData =
            $validatedData['fingerprint_js'] .
            $backendFingerprint .
            $validatedData['screen_resolution'] .
            $validatedData['timezone'] .
            $validatedData['language'];
        $multiFactorHash = hash('sha256', $combinedData);

        return [
            'backend_fingerprint' => $backendFingerprint,
            'multi_factor_hash' => $multiFactorHash,
        ];
    }
}
