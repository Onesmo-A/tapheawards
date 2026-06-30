<?php

namespace App\Models;

use App\Traits\HasUuids;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use function App\Helpers\public_storage_url;

class Nominee extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id',
        'name',
        'bio',
        'image_path',
        'facebook_url',
        'instagram_url',
        'tiktok_url',
        'source_application_id',
        'is_suspended',
    ];

    protected $appends = ['image_url'];

    protected $casts = [
        'is_suspended' => 'boolean',
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
/**
 * Get the publicly accessible URL for the nominee's image.
 * Returns null if no image is set.
 *
 * @return string|null
 */
public function getImageUrlAttribute(): string
    {
        if (! empty($this->image_path)) {
            return public_storage_url($this->image_path) ?? asset('images/logo.png');
        }

        return asset('images/logo.png');
}

}
