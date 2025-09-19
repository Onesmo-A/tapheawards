<?php

namespace App\Models;

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
     * Get the posts (photos) for the gallery album.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'gallery_album_id');
    }
}
