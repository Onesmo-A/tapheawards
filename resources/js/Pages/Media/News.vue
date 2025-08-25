<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import NewsCard from '@/Components/Media/NewsCard.vue';

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  news: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <Head title="Latest News" />
  
  <PageHeader 
    title="Latest News"
    subtitle="Stay updated with the latest announcements and news"
  />

  <section class="py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NewsCard 
          v-for="article in news" 
          :key="article.id" 
          :article="article"
        />
      </div>
    </div>
  </section>
</template>