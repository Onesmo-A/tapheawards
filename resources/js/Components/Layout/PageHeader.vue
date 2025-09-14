<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  title: String,
});
</script>

<template>
  <!-- BORESHO:
    - Padding zote zimeondolewa. Sasa padding itadhibitiwa na ukurasa unaotumia component hii.
  -->
  <div class="relative bg-gray-900 text-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
    <div class="relative z-10 text-center px-6 py-10 md:py-12">
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
