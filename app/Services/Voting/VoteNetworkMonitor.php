<?php

namespace App\Services\Voting;

use App\Models\VoteAttemptLog;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VoteNetworkMonitor
{
    public function inspect(Request $request, CarbonInterface $windowStart): array
    {
        $ipAddress = (string) $request->ip();
        $subnet = $this->subnetFor($ipAddress);

        $ipAttempts = VoteAttemptLog::query()
            ->where('ip_address', $ipAddress)
            ->where('attempted_at', '>=', $windowStart)
            ->count();

        $subnetAttempts = $subnet === null
            ? 0
            : VoteAttemptLog::query()
                ->where('subnet', $subnet)
                ->where('attempted_at', '>=', $windowStart)
                ->count();

        $uniqueFingerprintsPerIp = VoteAttemptLog::query()
            ->where('ip_address', $ipAddress)
            ->whereNotNull('fingerprint_js')
            ->where('attempted_at', '>=', $windowStart)
            ->select('fingerprint_js')
            ->distinct()
            ->count('fingerprint_js');

        $uniqueFingerprintsPerSubnet = $subnet === null
            ? 0
            : VoteAttemptLog::query()
                ->where('subnet', $subnet)
                ->whereNotNull('fingerprint_js')
                ->where('attempted_at', '>=', $windowStart)
                ->select('fingerprint_js')
                ->distinct()
                ->count('fingerprint_js');

        $reputation = $this->detectIpReputation($ipAddress);

        $suspiciousRules = [];

        if ($ipAttempts > (int) config('voting.max_votes_per_ip_per_hour', 50)) {
            $suspiciousRules[] = 'high_ip_attempt_volume';
        }

        if ($subnetAttempts > (int) config('voting.max_votes_per_subnet_per_hour', 100)) {
            $suspiciousRules[] = 'high_subnet_attempt_volume';
        }

        return [
            'subnet' => $subnet,
            'ip_attempts' => $ipAttempts,
            'subnet_attempts' => $subnetAttempts,
            'unique_fingerprints_per_ip' => $uniqueFingerprintsPerIp,
            'unique_fingerprints_per_subnet' => $uniqueFingerprintsPerSubnet,
            'vpn_detected' => $reputation['vpn_detected'],
            'proxy_detected' => $reputation['proxy_detected'],
            'hosting_detected' => $reputation['hosting_detected'],
            'asn_detected' => $reputation['asn_detected'],
            'asn_name' => $reputation['asn_name'],
            'suspicious_rules' => $suspiciousRules,
            'suspicious' => ! empty($suspiciousRules),
        ];
    }

    private function detectIpReputation(string $ipAddress): array
    {
        if ($this->isLocalOrPrivateIp($ipAddress)) {
            return [
                'vpn_detected' => false,
                'proxy_detected' => false,
                'hosting_detected' => false,
                'asn_detected' => false,
                'asn_name' => null,
            ];
        }

        $cacheKey = 'vote_ip_check_' . $ipAddress;

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($ipAddress) {
            $apiUrl = config('services.ip_check.url');
            $apiFields = collect(explode(',', (string) config('services.ip_check.fields', 'status,proxy,hosting,as,asname')))
                ->merge(['as', 'asname'])
                ->filter()
                ->unique()
                ->implode(',');

            if (! $apiUrl) {
                Log::warning('IP reputation API URL is not configured.');
                return [
                    'vpn_detected' => false,
                    'proxy_detected' => false,
                    'hosting_detected' => false,
                    'asn_detected' => false,
                    'asn_name' => null,
                ];
            }

            try {
                $response = Http::timeout(3)->get("{$apiUrl}/{$ipAddress}?fields={$apiFields}");

                if ($response->successful() && $response->json('status') === 'success') {
                    $proxy = (bool) $response->json('proxy');
                    $hosting = (bool) $response->json('hosting');
                    $asnName = strtolower((string) ($response->json('asname') ?? $response->json('as') ?? ''));
                    $asnDetected = collect(config('voting.suspicious_asn_keywords', []))
                        ->contains(fn ($keyword) => $keyword !== '' && str_contains($asnName, strtolower($keyword)));

                    return [
                        'vpn_detected' => $proxy || $hosting,
                        'proxy_detected' => $proxy,
                        'hosting_detected' => $hosting,
                        'asn_detected' => $asnDetected,
                        'asn_name' => $response->json('asname') ?? $response->json('as'),
                    ];
                }
            } catch (\Throwable $e) {
                Log::warning('IP reputation lookup failed for vote submission.', [
                    'ip_address' => $ipAddress,
                    'error' => $e->getMessage(),
                ]);
            }

            return [
                'vpn_detected' => false,
                'proxy_detected' => false,
                'hosting_detected' => false,
                'asn_detected' => false,
                'asn_name' => null,
            ];
        });
    }

    private function isLocalOrPrivateIp(string $ipAddress): bool
    {
        if (in_array($ipAddress, ['127.0.0.1', '::1'], true)) {
            return true;
        }

        return filter_var($ipAddress, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }

    private function subnetFor(string $ipAddress): ?string
    {
        if (filter_var($ipAddress, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $ipAddress);

            if (count($parts) === 4) {
                return sprintf('%s.%s.%s.0/24', $parts[0], $parts[1], $parts[2]);
            }
        }

        if (filter_var($ipAddress, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $parts = explode(':', $ipAddress);
            $prefix = array_slice($parts, 0, 4);

            return implode(':', array_pad($prefix, 4, '0')) . '::/64';
        }

        return null;
    }
}
