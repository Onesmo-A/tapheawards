<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TicketPurchase extends Model
{
    use HasFactory;

    const STATUS_PENDING_PAYMENT = 'pending_payment';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'payment_failed';

    protected $fillable = [
        'user_id',
        'transaction_id', // ONGEZA HAPA
        'ticket_type_id',
        'purchaser_name',
        'purchaser_email',
        'purchaser_phone',
        'quantity',
        'total_amount',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    /**
     * BORESHO: Tumia 'booted' method ili kutengeneza tiketi kiotomatiki
     * pindi tu status ya ununuzi inapobadilika kuwa 'completed'.
     */
    protected static function booted(): void
    {
        static::updated(function (TicketPurchase $purchase) {
            // Kagua kama status imebadilika na kuwa 'completed' na kama tiketi hazijatengenezwa
            if ($purchase->wasChanged('status') && $purchase->status === self::STATUS_COMPLETED && $purchase->tickets()->count() === 0) {
                $purchase->generateTickets();
            }
        });
    }

    /**
     * BORESHO: Method ya kutengeneza tiketi kwa ununuzi maalum.
     * Imetengwa ili iweze kuitwa na sehemu nyingine za mfumo ikihitajika.
     *
     * @param TicketPurchase $purchase
     */
    public function generateTickets(): void
    {
        try {
            for ($i = 0; $i < $this->quantity; $i++) {
                $this->tickets()->create([
                    'ticket_code' => 'TKT-' . strtoupper(Str::random(12)),
                ]);
            }
            Log::info("Successfully generated {$this->quantity} tickets for purchase ID: {$this->id}");
        } catch (\Exception $e) {
            Log::error("Failed to generate tickets for purchase ID: {$purchase->id}", ['error' => $e->getMessage()]);
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticketType(): BelongsTo
    {
        return $this->belongsTo(TicketType::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Pata transaction inayohusiana na ununuzi huu wa tiketi.
     */
    public function transaction(): MorphOne
    {
        return $this->morphOne(Transaction::class, 'payable');
    }

    /**
     * REKEBISHO: Pata transaction kupitia foreign key ya transaction_id.
     * Uhusiano huu unatumia 'transaction' (morphOne) kama msingi ili kuhakikisha
     * tunapata muamala sahihi unaohusiana na ununuzi huu.
     * Hii inatatua tatizo la 'Trying to get property 'order_id' of non-object' kwenye PDF.
     */
    public function mainTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }

    // ================== ACCESSORS FOR ZENO PAY SERVICE COMPATIBILITY ==================

    /**
     * Accessor kuhakikisha ZenoPaymentService inapata jina la mnunuaji.
     */
    public function getApplicantNameAttribute(): string
    {
        return $this->purchaser_name;
    }

    public function getApplicantEmailAttribute(): string
    {
        return $this->purchaser_email;
    }
}