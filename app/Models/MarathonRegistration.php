<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarathonRegistration extends Model
{
    use HasFactory;

    // BORESHO: Ongeza constants za status
    const STATUS_PENDING_PAYMENT = 'pending_payment';
    const STATUS_COMPLETED = 'completed';
    const STATUS_PAYMENT_FAILED = 'payment_failed';

    protected $fillable = [
        'unique_code',
        'full_name',
        'email',
        'phone_number',
        'gender',
        'date_of_birth',
        'race_type',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'address',
        'region',
        'country',
        'status',
        'payment_gateway_reference',
        'payment_notes',
        'tshirt_size',
    ];

    /**
     * Get the transaction associated with the marathon registration.
     */
    public function transaction()
    {
        return $this->morphOne(Transaction::class, 'payable');
    }
}