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

        'africastalking' => [
            'username' => env('AFRICASTALKING_USERNAME', 'sandbox'),
            'api_key' => env('AFRICASTALKING_API_KEY'),
            'from' => env('AFRICASTALKING_FROM'),
        ],

        'nextsms' => [
            'username' => env('NEXTSMS_USERNAME'),
            'password' => env('NEXTSMS_PASSWORD'),
            'sender_id' => env('NEXTSMS_SENDER_ID', 'N-SMS'),
            'use_test_mode' => env('NEXTSMS_USE_TEST_MODE', false),
        ],

        'ultramsg' => [
            'instance_id' => env('ULTRAMSG_INSTANCE_ID'),
            'token' => env('ULTRAMSG_TOKEN'),
        ],
    ],
];

