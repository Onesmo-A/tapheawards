<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeasonAward extends Model
{
    protected $fillable = [
        'year',
        'theme',
        'description',
        'event_date',
    ];
}
