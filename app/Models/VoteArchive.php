<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoteArchive extends Model
{
    use HasFactory;

    protected $fillable = [
        'season_award_id',
        'category_id',
        'nominee_id',
        'votes_count',
        'archived_at',
        'notes',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
        'votes_count' => 'integer',
    ];

    public function seasonAward(): BelongsTo
    {
        return $this->belongsTo(SeasonAward::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }
}
