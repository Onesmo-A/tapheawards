<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  title: String,
});
</script>

<template>
  <div class="relative h-40 md:h-52 flex items-center justify-center text-white overflow-hidden bg-cover bg-center" style="background-image: url('/images/backgrounds/page-header-bg.jpg');">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
    <div class="relative z-10 text-center px-6 pt-12 md:pt-16">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-gradient drop-shadow-glow">
        {{ title }}
      </h1>
      <div class="mt-2 text-sm md:text-base font-medium text-gray-300">
        <Link href="/" class="hover:text-[var(--accent-color)] transition-colors">Home</Link>
        <span class="mx-2">/</span>
        <span>{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
