<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// ================== HAPA NDIPO UNAWEKA SCHEDULE YAKO ==================
// Hii itaendesha mfanyakazi wa foleni (queue worker) kila dakika.
// --stop-when-empty inahakikisha mfanyakazi anafanya kazi zote zilizopo kisha anajizima.
// Hii ni muhimu sana kwa cron jobs ili kuzuia process nyingi kufunguliwa.
Schedule::command('queue:work --stop-when-empty')
         ->everyMinute()
         ->withoutOverlapping();

// BORESHO LA USALAMA: Endesha amri ya kuhakiki malipo ambayo hayajakamilika
// Hii ni kama 'wavu wa usalama' endapo webhook itafeli au kuchelewa.
// Itakimbia kila baada ya dakika kumi na tano.
Schedule::command('payments:verify-pending')
         ->everyFifteenMinutes();
