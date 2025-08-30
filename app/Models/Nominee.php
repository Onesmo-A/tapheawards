<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nominee extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'bio',
        'image_path',
        'facebook_url',
        'instagram_url'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Mshiriki anaweza kuwa na kura nyingi.
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

// ... ndani ya class ya Nominee
protected $appends = ['image_url'];

/**
 * Get the publicly accessible URL for the nominee's image.
 * Returns null if no image is set.
 *
 * @return string|null
 */
public function getImageUrlAttribute(): ?string
{
    if (empty($this->image_path)) {
        return null;
    }

    $cleanPath = str_replace('public/', '', $this->image_path);

    return \Illuminate\Support\Facades\Storage::url($cleanPath);
}

}