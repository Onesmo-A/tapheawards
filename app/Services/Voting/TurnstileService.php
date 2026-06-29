<?php

namespace App\Services\Voting;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    public function verify(?string $token, ?string $ipAddress = null): array
    {
        if (! (bool) config('voting.turnstile.enabled', false)) {
            return [
                'required' => false,
                'passed' => true,
                'success' => true,
                'error_codes' => [],
            ];
        }

        $secret = (string) config('voting.turnstile.secret_key');

        if ($secret === '') {
            Log::warning('Turnstile is enabled but no secret key is configured.');

            return [
                'required' => true,
                'passed' => false,
                'success' => false,
                'error_codes' => ['missing-secret'],
            ];
        }

        if (empty($token)) {
            return [
                'required' => true,
                'passed' => false,
                'success' => false,
                'error_codes' => ['missing-token'],
            ];
        }

        try {
            $response = Http::asForm()->timeout(5)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', array_filter([
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $ipAddress,
            ], fn ($value) => $value !== null && $value !== ''));

            $data = $response->json();

            return [
                'required' => true,
                'passed' => (bool) ($data['success'] ?? false),
                'success' => (bool) ($data['success'] ?? false),
                'action' => $data['action'] ?? null,
                'hostname' => $data['hostname'] ?? null,
                'challenge_ts' => $data['challenge_ts'] ?? null,
                'error_codes' => $data['error-codes'] ?? [],
                'cdata' => $data['cdata'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::warning('Turnstile verification failed.', [
                'error' => $e->getMessage(),
            ]);

            return [
                'required' => true,
                'passed' => false,
                'success' => false,
                'error_codes' => ['verification-error'],
            ];
        }
    }
}
