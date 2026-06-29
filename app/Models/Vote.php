<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'nominee_id', 
        'category_id',
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
        'voted_at',
    ];

    protected $casts = [
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
}
