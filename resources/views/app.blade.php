<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Hapa ndipo Inertia itaweka title yako. Jina la app linatumika kama fallback. -->
        <title inertia>{{ config('app.name', 'TAPHE Awards') }}</title>

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#9f0505ff">
    <meta name="msapplication-TileColor" content="#cd0707ff">
    <meta name="msapplication-config" content="/browserconfig.xml">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- ================== MABORESHO YA SEO ================== -->
    <!-- Maelezo ya Jumla -->
    <meta name="description" content="Tanzania Peoples Health Excellence Awards (TAPHE Awards) inatambua na kuenzi mchango wa wataalamu, taasisi, na mashirika katika sekta ya afya nchini Tanzania.">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tapheawards.co.tz/">
    <meta property="og:title" content="TAPHE Awards 2025 | Celebrating Healthcare Excellence">
    <meta property="og:description" content="Tanzania Peoples Health Excellence Awards (TAPHE Awards) inatambua na kuenzi mchango wa wataalamu, taasisi, na mashirika katika sekta ya afya nchini Tanzania.">
    <meta property="og:image" content="https://tapheawards.co.tz/images/logo.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="TAPHE Awards 2025 | Celebrating Healthcare Excellence">
    <meta property="twitter:description" content="Tanzania Peoples Health Excellence Awards (TAPHE Awards) inatambua na kuenzi mchango wa wataalamu, taasisi, na mashirika katika sekta ya afya nchini Tanzania.">
    <meta property="twitter:image" content="https://tapheawards.co.tz/images/logo.png">

    <!-- Scripts -->
    @routes
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
  </head>
  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
