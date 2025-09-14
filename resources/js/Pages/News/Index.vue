<script setup>
import { Head, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    newsItems: Object, // Hizi ni 'posts' zenye type='update'
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
</script>

<template>
  <Head :title="title" />

  <PageHeader 
    :title="title"
    subtitle="Pata taarifa za hivi punde na matangazo kutoka TAPHE Awards."
  />

  <main class="bg-background-section">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
      
      <!-- Ikiwa kuna habari -->
      <div v-if="newsItems && newsItems.data.length > 0" 
           class="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        
        <article v-for="post in newsItems.data" 
                 :key="post.id" 
                 class="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 shadow-lg">
          
          <img :src="post.featured_image_url" 
               :alt="post.title" 
               class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/60"></div>
          <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

          <div class="flex items-center gap-x-4 text-xs">
            <time :datetime="post.published_at" class="text-gray-300">
              {{ formatDate(post.published_at) }}
            </time>
          </div>
          
          <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
            <Link :href="route('posts.show', post.slug)">
              <span class="absolute inset-0"></span>
              {{ post.title }}
            </Link>
          </h3>
          
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-300">
            {{ post.excerpt }}
          </p>

          <!-- Kitufe cha "Soma Zaidi" ndani ya kadi -->
          <div class="mt-4">
              <span class="inline-flex items-center text-sm font-semibold text-white transition-opacity duration-300 opacity-80 group-hover:opacity-100">Soma Zaidi &rarr;</span>
          </div>
        </article>
      </div>

      <!-- Ikiwa hakuna habari -->
      <div v-else class="text-center text-gray-500">
        <p>Hakuna habari zilizowekwa kwa sasa. Tafadhali tembelea tena baadae.</p>
      </div>

    </div>
  </main>
</template>
