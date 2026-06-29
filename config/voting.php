<?php

return [
    /*
    |----------------------------------------------------------------------
    | Voting Thresholds
    |----------------------------------------------------------------------
    |
    | These values are intentionally configurable so the security posture can
    | be tuned without code changes as the audience or traffic patterns shift.
    */
    'behavioral_risk_threshold' => env('VOTING_BEHAVIORAL_RISK_THRESHOLD', 80),
    'minimum_page_time_seconds' => env('VOTING_MINIMUM_PAGE_TIME_SECONDS', 3),
    'max_votes_per_ip_per_hour' => env('VOTING_MAX_VOTES_PER_IP_PER_HOUR', 50),
    'max_votes_per_subnet_per_hour' => env('VOTING_MAX_VOTES_PER_SUBNET_PER_HOUR', 100),
    'rate_limit_attempts' => env('VOTING_RATE_LIMIT_ATTEMPTS', 10),
    'rate_limit_decay_minutes' => env('VOTING_RATE_LIMIT_DECAY_MINUTES', 10),
    'voting_window_hours' => env('VOTING_WINDOW_HOURS', 24),
    'vote_session_minutes' => env('VOTING_SESSION_MINUTES', 10),
    'vote_nonce_minutes' => env('VOTING_NONCE_MINUTES', 10),


    /*
    |----------------------------------------------------------------------
    | Bot Heuristics
    |----------------------------------------------------------------------
    */
    'bot_user_agent_patterns' => [
        '/bot/i',
        '/crawl/i',
        '/spider/i',
        '/slurp/i',
        '/headless/i',
        '/headlesschrome/i',
        '/phantom/i',
        '/phantomjs/i',
        '/selenium/i',
        '/puppeteer/i',
        '/playwright/i',
        '/python/i',
        '/python-requests/i',
        '/curl/i',
        '/wget/i',
        '/httpclient/i',
        '/guzzle/i',
        '/postman/i',
    ],

    'suspicious_asn_keywords' => [
        'digitalocean',
        'ovh',
        'hetzner',
        'vultr',
        'contabo',
        'linode',
        'leaseweb',
    ],
];
