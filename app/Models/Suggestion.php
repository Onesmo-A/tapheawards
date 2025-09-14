<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Suggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'suggested_nominee_name',
        'suggested_nominee_phone',
        'suggested_nominee_workplace',
        'category_id',
        'reason',
        'suggester_name',
        'suggester_email',
        'fingerprint_js', // Ongeza hii
        'status',
    ];

      /**
     * Kila suggestion inahusiana na category moja.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}