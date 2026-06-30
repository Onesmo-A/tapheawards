<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default OTP Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default OTP driver that will be used to send
    | verification codes. Supported: "log", "beem"
    |
    */
    'default' => env('OTP_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | OTP Driver Configurations
    |--------------------------------------------------------------------------
    */
    'drivers' => [
        'log' => [
            // No credentials needed, writes to laravel.log
        ],

        'beem' => [
            'api_key' => env('BEEM_API_KEY'),
            'secret_key' => env('BEEM_SECRET_KEY'),
            'sender_id' => env('BEEM_SENDER_ID', 'INFO'),
            'url' => 'https://api.beem.africa/v1/send',
        ],
    ],
];
