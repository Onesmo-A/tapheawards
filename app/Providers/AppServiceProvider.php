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
            // Ruhusu maombi 5 kwa dakika 1 kutoka kwa IP moja kwenda kwenye endpoint ya kura
            return Limit::perMinute(5)->by($request->ip());
        });

        // Sajili Policies
        Gate::policy(Winner::class, WinnerPolicy::class);

        Gate::policy(NomineeApplication::class, NomineeApplicationPolicy::class);

        // Hii ni kwa ajili ya mazingira ya production (kwenye server halisi)
        // Inahakisha link zote (routes, assets) zinatumia https
        if ($this->app->environment('local')) {
            URL::forceScheme('https');
        }
        elseif ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
