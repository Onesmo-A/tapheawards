<?php

namespace App\Mail;

use App\Models\TicketPurchase;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class TicketPaymentCompleted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public TicketPurchase $purchase
    ) {
        // Hakikisha uhusiano wote muhimu umepakiwa
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@tapheawards.co.tz', 'TAPHE Awards'),
            subject: 'Tiketi Zako za TAPHE Awards Ziko Tayari!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_payment_completed',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Pakia uhusiano muhimu hapa ili kuhakikisha data inapatikana
        $this->purchase->load(['ticketType', 'tickets', 'mainTransaction']);

        // BORESHO: Angalia kama 'imagick' inapatikana, la sivyo tumia 'gd'.
        if (extension_loaded('imagick') && config('qrcode.renderer') === 'imagick') {
            $qrCodeGenerator = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('png');
        } else {
            \Illuminate\Support\Facades\Log::warning('Imagick extension not found for queued email job. Falling back to GD for QR Code generation.');
            $qrCodeGenerator = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->renderer('gd');
        }

        $qrCodes = [];
        foreach ($this->purchase->tickets as $ticket) {
            $qrCodes[$ticket->id] = base64_encode(
                // Tumia generator tuliyotengeneza
                $qrCodeGenerator
                    ->size(200)
                    ->errorCorrection('H')
                    ->generate($ticket->ticket_code) 
            );
        }

        // BORESHO: Pata nembo ya mfadhili mkuu
        $mainSponsorLogo = null;
        $mainSponsorPath = public_path('images/sponsors/main-sponsor.png');
        if (file_exists($mainSponsorPath)) {
            $type = pathinfo($mainSponsorPath, PATHINFO_EXTENSION);
            $data = file_get_contents($mainSponsorPath);
            $mainSponsorLogo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        // BORESHO: Pata nembo za wafadhili wengine
        $otherSponsorLogos = [];
        $sponsorDir = public_path('images/sponsors');
        if (is_dir($sponsorDir)) {
            // BORESHO: Pata faili zote za picha na uiondoe ya mfadhili mkuu.
            $allSponsorFiles = glob($sponsorDir . '/*.{png,jpg,jpeg,svg}', GLOB_BRACE);
            foreach ($allSponsorFiles as $file) {
                if (basename($file) !== 'main-sponsor.png') {
                    $type = pathinfo($file, PATHINFO_EXTENSION);
                    $data = file_get_contents($file);
                    $otherSponsorLogos[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }
        }

        $pdf = Pdf::loadView('pdf.tickets', [
            'purchase' => $this->purchase,
            'qrCodes' => $qrCodes,
            'mainSponsorLogo' => $mainSponsorLogo,
            'otherSponsorLogos' => $otherSponsorLogos,
        ]);

        return [
            Attachment::fromData(fn () => $pdf->output(), 'TAPHE-Awards-Tickets.pdf')
                ->withMime('application/pdf'),
        ];
    }
}