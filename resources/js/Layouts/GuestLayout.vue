<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import TopBar from '@/Components/Layout/TopBar.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
</script>

<template>
    <Head>
        <meta name="description" content="Celebrating excellence and innovation in the Tanzanian business landscape. Vote for your favorite nominees and be part of the most prestigious business awards in the country." />
        <meta property="og:title" content="TAPHE Awards" />
        <meta property="og:description" content="Celebrating excellence and innovation in the Tanzanian business landscape." />
        <meta property="og:image" content="/images/og-image.jpg" />
    </Head>

    <div class="min-h-screen flex flex-col font-sans bg-background-main text-text-primary">
        <TopBar />
        <AppHeader />

        <!-- Main content -->
        <main class="flex-grow pt-20 md:pt-[7.5rem]">
            <!-- 
                MAREKEBISHO:
                - pt-20: Inaongeza nafasi juu (5rem) kwa ajili ya AppHeader kwenye simu.
                - md:pt-[7.5rem]: Inaongeza nafasi juu (7.5rem) kwa ajili ya TopBar (2.5rem) + AppHeader (5rem) kwenye desktop.
            -->
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
