<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'type',
        'gallery_album_id', // Ongeza hapa
        'status',
        'featured_image',
        'media_gallery',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'media_gallery' => 'array',
    ];

    /**
     * Get the album that the post belongs to.
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(GalleryAlbum::class, 'gallery_album_id');
    }
}
