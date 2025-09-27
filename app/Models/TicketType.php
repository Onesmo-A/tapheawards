<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity_available',
        'is_active',
        'features', // Ongeza 'features' hapa
    ];

    protected $casts = [
        'price' => 'integer',
        'is_active' => 'boolean',
        // BORESHO: Ongeza 'features' kwenye casts ili Laravel iitafsiri kama array
        'features' => 'array',
    ];

    public function ticketPurchases(): HasMany
    {
        return $this->hasMany(TicketPurchase::class);
    }
}
