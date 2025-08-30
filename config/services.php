<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'ip_check' => [
        'url' => env('IP_CHECK_API_URL', 'https://ip-api.com/json'),
        'fields' => env('IP_CHECK_API_FIELDS', 'status,proxy,hosting'),
    ],

    'zenopay' => [
        // URL ya msingi ya ZenoPay API
        'url' => env('ZENO_API_URL', 'https://zenoapi.com/api'),
        // API Key yako kutoka ZenoPay
        'key' => env('ZENO_API_KEY'),
        // Ada ya fomu ya maombi
        'application_fee' => env('NOMINATION_APPLICATION_FEE', 50000),
    ],

];
