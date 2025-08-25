<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/'))
            ->add(Url::create('/about'))
            ->add(Url::create('/tickets'))
            ->add(Url::create('/participate'))
            ->add(Url::create('/contact'))
            ->add(Url::create('/categories'))
            ->add(Url::create('/news'))
            ->add(Url::create('/gallery'))
            ->add(Url::create('/awards'))
            ->add(Url::create('/awards/categories'))
            ->add(Url::create('/awards/winners'))
            ->add(Url::create('/awards/vote'))
            ->add(Url::create('/event/guest-of-honor'))
            ->add(Url::create('/event/artists'))
            ->add(Url::create('/media/gallery'))
            ->add(Url::create('/season-awards'));

        // Kama unataka kuongeza slug za category au season awards dynamically, unaweza ongeza hapa

        return $sitemap->toResponse(request());
    }
}
