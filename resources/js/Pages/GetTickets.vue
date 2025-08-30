<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineProps({
  title: String,
});
</script>

<template>
  <Head :title="title" />
  <AppHeader />

  <main>
    <!-- Page Header -->
    <PageHeader :title="title" />

    <!-- Professional Ticket Call-to-Action Section -->
    <section class="relative bg-gradient-to-b from-black via-gray-900 to-black text-white py-32">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-red-500 text-base font-semibold uppercase tracking-wide mb-4">Taphe Awards Gala</h2>
        <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Celebrate Health Sector Excellence
        </h1>
        <p class="text-gray-300 text-lg md:text-xl mb-12 leading-relaxed">
          Be part of Tanzania's premier health awards gala. Witness outstanding achievements, network with leaders, and celebrate the innovators shaping the future of healthcare.
        </p>

        <!-- Call-to-Action Button -->
        <Link
          href="/login"
          class="btn-primary inline-block bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-5 rounded-full shadow-xl transition transform hover:scale-105"
        >
          Purchase Tickets Now, Secure Your Spot
        </Link>
      </div>

      <!-- Optional: subtle decorative shapes -->
      <div class="absolute top-0 left-0 w-32 h-32 bg-red-700 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-48 h-48 bg-red-700 opacity-15 rounded-full translate-x-1/2 translate-y-1/2"></div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
/* Optional: text gradient for main heading */
h1 {
  background: linear-gradient(90deg, #f59e0b, #f43f5e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
