<?php

namespace App\Services\Voting;

use App\Models\Nominee;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class VoteSessionService
{
    public function issue(Nominee $nominee, Request $request): array
    {
        $expiresAt = now()->addMinutes((int) config('voting.vote_session_minutes', 10));
        $context = $this->contextFingerprint($request);

        $payload = [
            'jti' => (string) Str::uuid(),
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'expires_at' => $expiresAt->timestamp,
            'issued_at' => now()->timestamp,
            'ip_hash' => $context['ip_hash'],
            'ua_hash' => $context['ua_hash'],
        ];

        $token = $this->encode($payload);
        Cache::put($this->sessionKey($payload['jti']), [
            'nominee_id' => $nominee->id,
            'category_id' => $nominee->category_id,
            'expires_at' => $expiresAt->timestamp,
            'ip_hash' => $context['ip_hash'],
            'ua_hash' => $context['ua_hash'],
        ], $expiresAt);

        return [
            'vote_session_token' => $token,
            'expires_at' => Carbon::createFromTimestamp($expiresAt->timestamp)->toIso8601String(),
        ];
    }

    public function consume(Nominee $nominee, Request $request, string $token): array
    {
        $payload = $this->decode($token);

        if ($payload === null) {
            throw new VoteSessionException('Invalid vote session token.');
        }

        if ((int) ($payload['nominee_id'] ?? 0) !== (int) $nominee->id || (int) ($payload['category_id'] ?? 0) !== (int) $nominee->category_id) {
            throw new VoteSessionException('Vote session token does not match this nominee.');
        }

        if ((int) ($payload['expires_at'] ?? 0) < now()->timestamp) {
            throw new VoteSessionException('Vote session token has expired.');
        }

        $context = $this->contextFingerprint($request);
        if (! hash_equals((string) ($payload['ip_hash'] ?? ''), $context['ip_hash']) || ! hash_equals((string) ($payload['ua_hash'] ?? ''), $context['ua_hash'])) {
            throw new VoteSessionException('Vote session token context does not match this browser.');
        }

        $sessionKey = $this->sessionKey((string) ($payload['jti'] ?? ''));
        $cached = Cache::pull($sessionKey);

        if (! is_array($cached)) {
            throw new VoteSessionException('Vote session token has already been used.');
        }

        if (! hash_equals((string) ($cached['ip_hash'] ?? ''), $context['ip_hash']) || ! hash_equals((string) ($cached['ua_hash'] ?? ''), $context['ua_hash'])) {
            throw new VoteSessionException('Vote session token context has changed.');
        }

        return $payload;
    }

    public function consumeNonce(string $sessionJti, string $nonce): bool
    {
        if ($sessionJti === '' || $nonce === '') {
            return false;
        }

        $nonceKey = $this->nonceKey($sessionJti, $nonce);

        return Cache::add(
            $nonceKey,
            now()->toIso8601String(),
            now()->addMinutes((int) config('voting.vote_nonce_minutes', 10))
        );
    }

    private function encode(array $payload): string
    {
        $json = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $signature = hash_hmac('sha256', $json, (string) config('app.key'));

        return rtrim(strtr(base64_encode($json), '+/', '-_'), '=') . '.' . $signature;
    }

    private function decode(string $token): ?array
    {
        [$encoded, $signature] = array_pad(explode('.', $token, 2), 2, null);

        if (! $encoded || ! $signature) {
            return null;
        }

        $json = base64_decode(strtr($encoded, '-_', '+/'), true);

        if ($json === false) {
            return null;
        }

        $expected = hash_hmac('sha256', $json, (string) config('app.key'));

        if (! hash_equals($expected, $signature)) {
            return null;
        }

        $payload = json_decode($json, true);

        return is_array($payload) ? $payload : null;
    }

    private function sessionKey(string $jti): string
    {
        return 'vote_session:' . $jti;
    }

    private function contextFingerprint(Request $request): array
    {
        return [
            'ip_hash' => hash('sha256', (string) $request->ip()),
            'ua_hash' => hash('sha256', (string) $request->userAgent()),
        ];
    }

    private function nonceKey(string $jti, string $nonce): string
    {
        return 'vote_nonce:' . $jti . ':' . hash('sha256', $nonce);
    }
}

class VoteSessionException extends \RuntimeException
{
}
