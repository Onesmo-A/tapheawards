<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['image_url'];

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'image_path',
        'status',
    ];

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories (sub-categories/awards).
     * Hii ndiyo relationship muhimu kwa tatizo lako.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get the nominees for the category.
     */
    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }

    /**
     * Get the applications for the category.
     */
    public function nomineeApplications(): HasMany
    {
        return $this->hasMany(NomineeApplication::class);
    }

    /**
     * Get the publicly accessible URL for the category's image.
     * Returns a default placeholder if no image is set.
     *
     * @return string
     */
    public function getImageUrlAttribute(): string
    {
        // Kama kuna picha, rudisha URL yake
        if ($this->image_path) {
            return Storage::url($this->image_path);
        }
        // Kama hakuna picha, rudisha URL ya picha mbadala (placeholder)
        return asset('images/placeholder.png');
    }
}