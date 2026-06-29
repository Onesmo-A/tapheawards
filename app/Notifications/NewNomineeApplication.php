<?php

namespace App\Notifications;

use App\Models\NomineeApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewNomineeApplication extends Notification implements ShouldQueue
{
    use Queueable;

    protected $application;

    /**
     * Create a new notification instance.
     */
    public function __construct(NomineeApplication $application)
    {
        $this->application = $application;
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
        $adminUrl = route('admin.applications.show', $this->application->id);

        return (new MailMessage)
                    ->subject('Ombi Jipya la Ushiriki Limepokelewa')
                    ->greeting('Habari Admin,')
                    ->line('Umepokea ombi jipya la ushiriki ambalo sasa limelipiwa kikamilifu na linasubiri kupitiwa.')
                    ->line('**Jina la Mwombaji:** ' . $this->application->applicant_name)
                    ->line('**Kategoria:** ' . $this->application->category->name)
                    ->action('Angalia Ombi', $adminUrl)
                    ->line('Asante kwa kutumia mfumo huu.');
    }
}