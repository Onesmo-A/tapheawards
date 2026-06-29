<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import WinnerCard from '@/Components/Awards/WinnerCard.vue';

const props = defineProps({
  season: Object,
  winners: Array
});
</script>

<template>
  <Head :title="`Winners - ${season.year}`" />

  <AppHeader />

  <main class="bg-black text-white">
    <section class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-base font-semibold text-yellow-400 uppercase">Winners</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl text-gold-gradient">{{ season.theme }}</p>
          <p class="mt-6 text-lg leading-8 text-gray-400">
            Honoring the outstanding achievers of {{ season.year }}.
          </p>
        </div>

        <div v-if="winners.length" class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <WinnerCard
            v-for="winner in winners"
            :key="winner.id"
            :winner="winner"
          />
        </div>

        <div v-else class="mt-16 text-center text-gray-400">
          <p>No winners found for this season.</p>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
