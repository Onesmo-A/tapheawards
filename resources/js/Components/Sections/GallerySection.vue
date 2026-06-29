<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
  updates: Array,
  title: String,
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Weka kikomo cha habari zinazoonyeshwa (k.m., 3)
const limit = 3;
const limitedUpdates = computed(() => {
  return props.updates ? props.updates.slice(0, limit) : [];
});
</script>

<template>
  <section id="updates" class="will-animate-section scroll-mt-20 overflow-hidden bg-background-section py-20 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mb-16 text-center" style="transition-delay: 200ms;">
        <h2 class="text-base font-semibold uppercase leading-7 text-text-accent">Stay Informed</h2>
        <p class="text-primary-gradient mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
         Updates & Highlights
        </p>
      </div>

      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article
            v-for="(post, index) in limitedUpdates"
            :key="index"
            class="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 shadow-lg"
            :style="{ 'transition-delay': (400 + index * 100) + 'ms' }"
        >
            <img :src="post.featured_image_url" :alt="post.title" class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/60"></div>
            <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

            <div class="flex items-center gap-x-4 text-xs">
                <time :datetime="post.published_at" class="text-gray-300">{{ formatDate(post.published_at) }}</time>
            </div>
            <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
                <Link :href="route('posts.show', post.slug)">
                    <span class="absolute inset-0"></span>
                    {{ post.title }}
                </Link>
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-gray-300">{{ post.excerpt }}</p>
            
            <!-- Kitufe cha "Soma Zaidi" ndani ya kadi -->
            <div class="mt-4">
                <span class="inline-flex items-center text-sm font-semibold text-white transition-opacity duration-300 opacity-80 group-hover:opacity-100">Soma Zaidi &rarr;</span>
            </div>
        </article>
      </div>

      <!-- Kitufe cha "Read More" -->
      <div v-if="updates && updates.length > limit" class="mt-16 text-center">
        <Link :href="route('news.index')" class="btn-secondary">
          Soma Habari Zaidi
        </Link>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
