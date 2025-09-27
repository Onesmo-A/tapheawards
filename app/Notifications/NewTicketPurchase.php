<?php

namespace App\Notifications;

use App\Models\TicketPurchase;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTicketPurchase extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public TicketPurchase $purchase
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail']; // Unaweza kuongeza 'database' baadaye
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format($this->purchase->total_amount, 0);
        $quantity = $this->purchase->quantity;
        $ticketType = $this->purchase->ticketType->name;

        return (new MailMessage)
            ->subject("Ununuzi Mpya wa Tiketi: {$quantity}x {$ticketType}")
            ->greeting('Habari Admin,')
            ->line("Umepokea ununuzi mpya wa tiketi.")
            ->line("**Mnunuaji:** {$this->purchase->purchaser_name}")
            ->line("**Aina ya Tiketi:** {$ticketType}")
            ->line("**Idadi:** {$quantity}")
            ->line("**Jumla:** TZS {$amount}")
            ->action('Angalia Manunuzi Yote', route('admin.tickets.dashboard'))
            ->line('Asante kwa kutumia mfumo huu.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'purchase_id' => $this->purchase->id,
            'message' => "Ununuzi mpya wa tiketi {$this->purchase->quantity}x kutoka kwa {$this->purchase->purchaser_name}.",
        ];
    }
}