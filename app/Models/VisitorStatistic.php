<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorStatistic extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'visitor_key',
        'ip_address',
        'user_agent',
        'path',
        'route_name',
        'referrer',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];
}
