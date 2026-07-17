<?php

namespace App\Models;

use App\Traits\HasUuids;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ticket_purchase_id',
        'ticket_code',
        'qr_code_path',
        'checked_in_at',
        'checked_in_by',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
    ];

    public static function generateSecureCode(): string
    {
        $random = strtoupper(\Illuminate\Support\Str::random(10));
        $signature = substr(hash_hmac('sha256', $random, config('app.key')), 0, 6);
        return 'TKT-' . $random . '-' . strtoupper($signature);
    }

    public static function verifyCode(string $code): bool
    {
        $parts = explode('-', $code);
        if (count($parts) !== 3 || $parts[0] !== 'TKT') {
            return false;
        }
        $random = $parts[1];
        $signature = $parts[2];
        $expectedSignature = strtoupper(substr(hash_hmac('sha256', $random, config('app.key')), 0, 6));
        return hash_equals($expectedSignature, $signature);
    }

    public function ticketPurchase(): BelongsTo
    {
        return $this->belongsTo(TicketPurchase::class);
    }

    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }
}