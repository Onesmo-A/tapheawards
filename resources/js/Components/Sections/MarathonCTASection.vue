<script setup>
import { Link } from '@inertiajs/vue3';
</script>
<template>
    <!-- BORESHO: Muundo mpya wa banner -->
    <section
        class="relative bg-cover bg-center text-white py-24 sm:py-32"
        style="background-image: url('/images/backgrounds/marathon-bg.jpg');"
    >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-base font-semibold uppercase tracking-wider text-white mb-2">
                JOIN THE MOVEMENT
            </h2>
            <h1 class="mt-4 text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                TAPHE Awards Marathon 2025
            </h1>
            <p class="mt-6 text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Run for a cause! Join hundreds of health enthusiasts, professionals, and the public in a race that promotes wellness and celebrates our healthcare heroes. Every step you take supports a healthier Tanzania.
            </p>

            <div class="mt-12 flex items-center justify-center gap-x-6">
                <Link :href="route('marathon.register')" class="btn-primary inline-block text-lg px-10 py-4 rounded-full shadow-xl transition transform hover:scale-105">
                    Register Now
                </Link>
                <Link :href="route('marathon.check-status-page')" class="text-sm font-semibold leading-6 text-white hover:text-red-400">
                    Check status <span aria-hidden="true">→</span>
                </Link>
            </div>
        </div>
    </section>
</template>