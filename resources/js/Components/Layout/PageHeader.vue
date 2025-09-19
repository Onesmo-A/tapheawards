<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  title: String,
  subtitle: String, // NEW: Ongeza subtitle prop
});
</script>

<template>
  <!-- BORESHO:
    - Padding zote zimeondolewa. Sasa padding itadhibitiwa na ukurasa unaotumia component hii.
  -->
  <div class="relative bg-gray-900 text-white overflow-hidden">
    <div class="absolute inset-0">
        <img src="/images/backgrounds/breadcrumb-bg.jpg" alt="Background" class="w-full h-full object-cover opacity-10" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
    </div>
    <div class="relative z-10 text-center px-6 py-16 md:py-20">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-gradient drop-shadow-glow">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
