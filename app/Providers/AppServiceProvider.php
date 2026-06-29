<?php

namespace App\Providers;

use App\Models\NomineeApplication;
use App\Models\Winner;
use App\Models\Vote;
use App\Policies\WinnerPolicy;
use App\Policies\NomineeApplicationPolicy;
use App\Observers\VoteObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
// app/Providers/RouteServiceProvider.php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Sajili VoteObserver ili iweze kuongeza na kupunguza
        // idadi ya kura kiotomatiki kwenye mshiriki husika.
        Vote::observe(VoteObserver::class);
        Vite::prefetch(concurrency: 3);

        RateLimiter::for('votes', function (Request $request) {
            // Named limiter still exists for future middleware use, but the
            // controller now applies the same policy directly so we can log
            // every blocked attempt.
            return Limit::perMinute((int) config('voting.rate_limit_attempts', 10))->by($request->ip());
        });

        // Sajili Policies
        Gate::policy(Winner::class, WinnerPolicy::class);

        Gate::policy(NomineeApplication::class, NomineeApplicationPolicy::class);

        // Force HTTPS only when the deployed app URL itself is HTTPS.
        // Hii inaepuka local dev kujaribu kufungua assets kwa https wakati server ni http.
        if ($this->app->environment('production') && str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }
    }
}
