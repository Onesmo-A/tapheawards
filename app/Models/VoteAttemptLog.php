<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoteAttemptLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'nominee_id',
        'category_id',
        'status',
        'reason',
        'ip_address',
        'subnet',
        'user_agent',
        'fingerprint_js',
        'screen_resolution',
        'timezone',
        'language',
        'page_time_seconds',
        'mouse_move_count',
        'scroll_count',
        'focus_count',
        'blur_count',
        'multi_factor_hash',
        'risk_score',
        'triggered_rules',
        'vpn_detected',
        'proxy_detected',
        'hosting_detected',
        'rate_limited',
        'behavior_metrics',
        'asn_name',
        'asn_detected',
        'meta',
        'attempted_at',
    ];

    protected $casts = [
        'page_time_seconds' => 'integer',
        'mouse_move_count' => 'integer',
        'scroll_count' => 'integer',
        'focus_count' => 'integer',
        'blur_count' => 'integer',
        'risk_score' => 'integer',
        'triggered_rules' => 'array',
        'vpn_detected' => 'boolean',
        'proxy_detected' => 'boolean',
        'hosting_detected' => 'boolean',
        'rate_limited' => 'boolean',
        'behavior_metrics' => 'array',
        'asn_detected' => 'boolean',
        'meta' => 'array',
        'attempted_at' => 'datetime',
    ];

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
