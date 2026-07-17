<?php

namespace App\Models;

use App\Traits\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotePackage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'votes',
        'price',
        'label',
        'sub',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'votes' => 'integer',
        'price' => 'float',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
