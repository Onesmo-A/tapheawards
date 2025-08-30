<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineProps({
  title: String,
  forms: Array,
});
</script>

<template>
  <Head :title="title" />
  <AppHeader />

  <main>
    <PageHeader :title="title" />

    <section class="bg-white py-20 sm:py-32 text-gray-900">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base font-semibold leading-7 text-red-500 uppercase">Participate</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl text-red-gradient">
            Tanzania Peaople's Health Excellence Awards
          </p>
          <p class="mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-700">
            Select a category and log in to participate in the upcoming Health Sector Excellence Awards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Corporate / Department-Based Awards -->
          <div class="bg-red-50/80 p-8 rounded-2xl border border-red-200 flex flex-col shadow hover:shadow-lg transition-shadow duration-300">
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-red-600">Corporate / Department-Based Awards</h3>
              <p class="mt-4 text-gray-700">
                Participate as a company, department, or institution providing outstanding healthcare services.
              </p>
            </div>
            <div class="mt-8">
              <a href="/login" class="btn-primary w-full inline-block text-center bg-red-500 text-white font-bold py-3 px-5 rounded-md shadow hover:scale-105 transition-transform duration-300">
                Log In
              </a>
            </div>
          </div>

          <!-- Individual / Professional Excellence Awards -->
          <div class="bg-black/80 p-8 rounded-2xl border border-gray-800 flex flex-col shadow hover:shadow-lg transition-shadow duration-300">
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-white">Individual / Professional Excellence Awards</h3>
              <p class="mt-4 text-gray-300">
                Participate as a doctor, nurse, or healthcare professional demonstrating excellence in your field.
              </p>
            </div>
            <div class="mt-8">
              <a href="/login" class="btn-primary w-full inline-block text-center bg-red-500 text-white font-bold py-3 px-5 rounded-md shadow hover:scale-105 transition-transform duration-300">
                Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
.text-red-gradient {
  background: linear-gradient(to right, #ff7f7f, #ff4d4d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
