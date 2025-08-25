<script setup>
import { Link, Head } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Sponsors from '@/Components/Sponsors.vue';
import FacebookIcon from '@/Components/Icons/FacebookIcon.vue';
import InstagramIcon from '@/Components/Icons/InstagramIcon.vue';
import TwitterIcon from '@/Components/Icons/TwitterIcon.vue';
import LinkedInIcon from '@/Components/Icons/LinkedInIcon.vue';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
</script>

<template>
    <Head>
        <title>Business Awards</title>
        <meta name="description" content="Celebrating excellence and innovation in the Tanzanian business landscape. Vote for your favorite nominees and be part of the most prestigious business awards in the country." />
        <meta property="og:title" content="Business Awards" />
        <meta property="og:description" content="Celebrating excellence and innovation in the Tanzanian business landscape." />
        <meta property="og:image" content="/images/og-image.jpg" />
    </Head>

    <div class="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
        <AppHeader />

        <!-- Main content -->
        <main class="flex-grow">
            <slot />
        </main>

        <AppFooter />
    </div>
</template>

<style>
.will-animate-card {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.will-animate-card.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.will-animate-section {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.will-animate-section.is-visible {
    opacity: 1;
    transform: translateY(0);
}
</style>
