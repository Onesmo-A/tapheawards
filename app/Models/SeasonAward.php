<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use function App\Helpers\public_storage_url;

class SeasonAward extends Model
{
    protected $fillable = [
        'year',
        'theme',
        'description',
        'event_date',
        'cover_image_path',
        'event_location_name',
        'event_location_address',
        'event_location_map_url',
    ];

    protected $appends = ['cover_image_url'];

    public function getCoverImageUrlAttribute(): ?string
    {
        if (empty($this->cover_image_path)) {
            return asset('images/placeholder.png');
        }

        $path = ltrim($this->cover_image_path, '/');

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return public_storage_url($path) ?? asset('images/placeholder.png');
    }
}
