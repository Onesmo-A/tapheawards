<?php

namespace App\Models;

use App\Traits\HasUuids;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function App\Helpers\public_storage_url;

class HeroBanner extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'eyebrow',
        'badge',
        'title',
        'description',
        'image_path',
        'primary_button_text',
        'primary_button_url',
        'secondary_button_text',
        'secondary_button_url',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(): string
    {
        if (empty($this->image_path)) {
            return asset('images/hero/slide-1.png');
        }

        if (str_starts_with($this->image_path, 'images/')) {
            return asset($this->image_path);
        }

        return public_storage_url($this->image_path) ?? asset('images/hero/slide-1.png');
    }
}
