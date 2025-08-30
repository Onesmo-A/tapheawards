<?php

namespace App\Http\Controllers;

use App\Models\Category;
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
            ->add(Url::create('/gallery'));

        // Ongeza URLs za kategoria zote kiotomatiki
        Category::all()->each(function (Category $category) use ($sitemap) {
            // Hakikisha unatumia route helper na slug kama unavyofanya kwenye web.php
            $sitemap->add(Url::create(route('categories.show', $category->slug)));
        });

        // Kama unataka kuongeza slug za category au season awards dynamically, unaweza ongeza hapa

        return $sitemap->toResponse(request());
    }
}
