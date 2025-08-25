<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
</script>

<template>
  <Head title="Gallery" />

  <AppHeader />

  <main class="bg-black text-white min-h-screen">
    <div class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Event Moments</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">Photo Gallery</p>
          <p class="mt-6 text-lg leading-8 text-gray-400">
            Explore photos and videos from our past events and award ceremonies.
          </p>
        </div>

        <div class="mt-16 text-center text-gray-400">
          <p>The photo gallery will be available here soon. Please check back later.</p>
        </div>
      </div>
    </div>
  </main>

  <AppFooter />
</template>