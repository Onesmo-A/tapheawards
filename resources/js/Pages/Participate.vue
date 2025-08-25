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

    <section class="bg-black py-20 sm:py-32 text-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Get Involved</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
            Your Journey to Recognition Starts Here
          </p>
          <p class="mt-6 max-w-3xl mx-auto text-lg leading-8 text-gray-400">
            Download the necessary forms to nominate, apply, or partner with us for the upcoming Tanzania Business Awards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="form in forms" :key="form.title" class="bg-gray-900/50 p-8 rounded-2xl border border-yellow-400/20 flex flex-col">
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-white">{{ form.title }}</h3>
              <p class="mt-4 text-gray-400">{{ form.description }}</p>
            </div>
            <div class="mt-8">
              <a :href="form.url" download class="w-full inline-block text-center bg-gold-gradient text-[#422D03] font-bold py-3 px-5 rounded-md shadow-lg shadow-yellow-500/30 hover:scale-105 transition-all duration-300">
                Download PDF
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
.text-gold-gradient {
  background: linear-gradient(to right, #ff0000, #ff0000, #ff0000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-gold-gradient {
  background: linear-gradient(145deg, #461a1a 0%, #b41111 20%, #fca8a8 50%, #b41111 80%, #46381a 100%);
  background-size: 200% 100%;
  transition: background-position 0.5s ease-in-out;
}
.bg-gold-gradient:hover:not(:disabled) {
  background-position: 100% 0;
}
</style>