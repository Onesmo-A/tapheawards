<?php

namespace App\Notifications;

use App\Models\MarathonRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMarathonRegistration extends Notification implements ShouldQueue
{
    use Queueable;

    protected $registration;

    /**
     * Create a new notification instance.
     */
    public function __construct(MarathonRegistration $registration)
    {
        $this->registration = $registration;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $adminUrl = route('admin.marathon.show', $this->registration->id);

        return (new MailMessage)
                    ->subject('Usajili Mpya wa Marathon Umepokelewa')
                    ->greeting('Habari Admin,')
                    ->line('Umepokea usajili mpya wa marathon ambao umelipiwa kikamilifu.')
                    ->line('**Jina la Mshiriki:** ' . $this->registration->full_name)
                    ->line('**Namba ya Kipekee:** ' . $this->registration->unique_code)
                    ->line('**Aina ya Mbio:** ' . $this->registration->race_type)
                    ->action('Angalia Usajili', $adminUrl)
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
            //
        ];
    }
}
