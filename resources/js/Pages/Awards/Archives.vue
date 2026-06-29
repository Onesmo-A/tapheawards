<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head } from '@inertiajs/vue3';
import AwardSeasonCard from '@/Components/Awards/AwardSeasonCard.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({ layout: DefaultLayout });

defineProps({
    title: String,
    description: String,
    seasons: Array,
});
</script>

<template>
  <Head :title="title" />

  <PageHeader :title="title" :subtitle="description" />

  <section class="bg-black py-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div v-if="seasons.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AwardSeasonCard v-for="season in seasons" :key="season.id" :season="season" />
      </div>
      <div v-else class="text-center text-gray-400 py-20">
        No award seasons available yet.
      </div>
    </div>
  </section>
</template>
