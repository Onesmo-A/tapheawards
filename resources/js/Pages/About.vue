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
    <section class="py-20 sm:py-32 bg-[var(--background-section)]">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Image -->
          <div class="group">
            <img src="/images/about-us.jpg" alt="Health Awards Event" 
                 class="rounded-xl shadow-primary-glow border-2 border-[var(--accent-primary)] group-hover:shadow-primary-glow transition-shadow duration-300">
          </div>
          
          <!-- Right Content -->
          <div>
            <h2 class="text-base font-semibold leading-7 uppercase text-[var(--accent-primary)]">Our Mission</h2>
            <p class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-primary-gradient">
              Celebrating Excellence in Tanzania’s Health Sector
            </p>
            
            <p class="mt-8 text-lg text-[var(--text-primary)] leading-8">
              The Health Awards were established to recognize and honor outstanding achievements of individuals, institutions, and professionals in the healthcare sector across Tanzania. Our mission is to foster excellence, innovation, and integrity in healthcare services at every level.
            </p>

            <p class="mt-6 text-lg text-[var(--text-primary)] leading-8">
              Each year, we bring together healthcare leaders, medical practitioners, innovators, and key stakeholders to celebrate those who have demonstrated exceptional dedication, leadership, and contribution to improving health outcomes and advancing the healthcare system in Tanzania.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped></style>
