<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineProps({
  title: String,
  description: String,
});
</script>

<template>
  <Head :title="title" />
  <AppHeader />

  <main>
    <!-- Page Header with Breadcrumb -->
    <PageHeader :title="title" />

    <!-- About Content Section -->
    <section class="bg-black py-20 sm:py-32 text-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Image -->
          <div class="group">
            <img src="/images/about-us.jpg" alt="TBA Event" class="rounded-xl shadow-2xl shadow-black/50 border-2 border-[var(--accent-color)]/20 group-hover:shadow-[var(--primary-color)]/20 transition-shadow duration-300">
          </div>
          
          <!-- Right Content -->
          <div>
            <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">Our Mission</h2>
            <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient">
              Celebrating Excellence in Tanzanian Business
            </p>
       <p class="mt-8 text-lg text-gray-300 leading-8">
  The Business Awards were established to recognize and celebrate the outstanding achievements of businesses and entrepreneurs across the nation — from large corporations to small and medium-sized enterprises. Our mission is to foster a culture of excellence, innovation, and integrity within the Tanzanian business community at every level.
</p>

            <p class="mt-6 text-lg text-gray-300 leading-8">
              Each year, we bring together industry leaders, emerging talents, and key stakeholders to honor those who have demonstrated exceptional performance, leadership, and contribution to the economic growth of Tanzania through businesses.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped></style>