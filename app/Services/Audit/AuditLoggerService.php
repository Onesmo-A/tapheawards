<?php

namespace App\Services\Audit;

use App\Models\AuditLog;

class AuditLoggerService
{
    /**
     * Log an administrative action with integrity signature.
     */
    public static function log(
        string $adminUserId,
        string $action,
        string $modelType,
        string $modelId,
        ?array $beforeState = null,
        ?array $afterState = null
    ): AuditLog {
        $ipAddress = request()->ip() ?? '127.0.0.1';
        
        // Calculate HMAC signature
        $secret = config('app.key');
        $payload = $adminUserId . $action . $modelType . $modelId . $ipAddress;
        $integrityHash = hash_hmac('sha256', $payload, $secret);

        return AuditLog::create([
            'admin_user_id' => $adminUserId,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'before_state' => $beforeState,
            'after_state' => $afterState,
            'ip_address' => $ipAddress,
            'integrity_hash' => $integrityHash,
        ]);
    }

    /**
     * Verify the integrity of a specific audit log entry.
     */
    public static function verify(AuditLog $log): bool
    {
        $secret = config('app.key');
        $payload = $log->admin_user_id . $log->action . $log->model_type . $log->model_id . $log->ip_address;
        $expectedHash = hash_hmac('sha256', $payload, $secret);

        return hash_equals($log->integrity_hash, $expectedHash);
    }
}
