<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_path',
        'parent_id',
    ];

    /**
     * Append the public URL for the image.
     */
    protected $appends = ['image_url'];

    /**
     * Automatically create a slug from the name if not provided.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }

    /**
     * Get the winner for this category.
     */
    public function winners(): HasMany
    {
        return $this->hasMany(Winner::class);
    }

    /**
     * Get the publicly accessible URL for the category's image.
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

        return Storage::url($cleanPath);
    }
}