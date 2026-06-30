<?php

namespace App\Models;

use App\Traits\HasUuids;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nominee_id', 
        'category_id',
        'transaction_id',
        'phone_number',
        'votes_count',
        'ip_address', 
        'user_agent',
        'fingerprint',
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
        'integrity_hash',
        'voted_at',
    ];

    protected $casts = [
        'votes_count' => 'integer',
        'page_time_seconds' => 'integer',
        'mouse_move_count' => 'integer',
        'scroll_count' => 'integer',
        'focus_count' => 'integer',
        'blur_count' => 'integer',
        'voted_at' => 'datetime',
    ];

    /**
     * Kura ni ya mshiriki mmoja.
     */
    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
