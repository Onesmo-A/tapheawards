<?php

namespace App\Models;

use App\Traits\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoryGroup extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
    ];

    /**
     * Get the categories (awards) belonging to this group.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class, 'category_group_id');
    }
}
