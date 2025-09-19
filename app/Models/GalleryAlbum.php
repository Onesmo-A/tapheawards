<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class GalleryAlbum extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'cover_image',
        'is_published',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['cover_image_url'];

    /**
     * Get the posts (photos) for the gallery album.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'gallery_album_id');
    }

    /**
     * Get the publicly accessible URL for the album's cover image.
     * Returns null if no image is set.
     *
     * @return string|null
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if (empty($this->cover_image)) {
            return null;
        }
        return Storage::url($this->cover_image);
    }
}
