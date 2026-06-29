<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'guest_name',
        'guest_title',
        'event_name',
        'event_date',
        'event_time',
        'event_venue',
        'dress_code',
        'status',
        'event_description',
        'viewed_at',
        'rsvp_status', // Ongeza hapa
        'rsvp_at',     // Ongeza na hii
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
        'rsvp_at' => 'datetime', // Ongeza na hii
    ];
}
