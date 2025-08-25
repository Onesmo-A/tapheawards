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
        'multi_factor_hash',
        'voted_at',
    ];



    /**
     * Kura ni ya mshiriki mmoja.
     */
    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }
}
