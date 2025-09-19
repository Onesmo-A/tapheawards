<?php

namespace App\Mail;

use App\Models\MarathonRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MarathonPaymentCompleted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The marathon registration instance.
     *
     * @var \App\Models\MarathonRegistration
     */
    public $registration;

    /**
     * Create a new message instance.
     */
    public function __construct(MarathonRegistration $registration)
    {
        $this->registration = $registration;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Uthibitisho wa Malipo ya Usajili wa Marathon',
        );
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.marathon.payment_completed');
    }
}
