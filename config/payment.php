<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Payment Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment gateway driver that will be
    | used to initiate mobile money transaction push notifications.
    | Supported: "log", "malipopay", "azampay"
    |
    */
    'default' => env('PAYMENT_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Payment Gateway Configurations
    |--------------------------------------------------------------------------
    */
    'drivers' => [
        'log' => [
            // Mock gateway, automatically succeeds or updates logs
        ],

        'malipopay' => [
            'api_key' => env('MALIPOPAY_API_KEY'),
            'api_secret' => env('MALIPOPAY_API_SECRET'),
            'url' => env('MALIPOPAY_URL', 'https://api.malipopay.co.tz/v1'),
            'webhook_url' => env('MALIPOPAY_WEBHOOK_URL'),
        ],

        'azampay' => [
            'api_key' => env('AZAMPAY_API_KEY'),
            'api_secret' => env('AZAMPAY_API_SECRET'),
            'url' => env('AZAMPAY_URL', 'https://sandbox.azampay.co.tz'), // sandbox or production
            'webhook_url' => env('AZAMPAY_WEBHOOK_URL'),
            'app_name' => env('AZAMPAY_APP_NAME', 'TAPHE Awards'),
            'client_id' => env('AZAMPAY_CLIENT_ID'),
        ],
    ],
];
