<script setup>
import { Head, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import Pagination from '@/Components/Pagination.vue';

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  albums: Object,
  title: String,
  description: String,
});
</script>

<template>
  <Head>
    <title>{{ title }}</title>
    <meta name="description" :content="description" />
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" :content="title" />
    <meta property="og:description" :content="description" />
    <meta property="og:image" content="/images/logo.png" />
    <meta property="og:url" :content="route('gallery.index')" />
    <meta property="twitter:card" content="summary_large_image" />
  </Head>

  <div class="bg-background-section pt-24 sm:pt-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ title }}</h2>
        <p class="mt-2 text-lg leading-8 text-gray-300">{{ description }}</p>
      </div>

      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="album in albums.data" :key="album.id" class="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 shadow-lg">
          <img :src="album.cover_image" :alt="album.name" class="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/60"></div>
          <div class="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>

          <h3 class="mt-3 text-lg font-semibold leading-6 text-white">
            <Link :href="route('gallery.show', album.slug)">
              <span class="absolute inset-0"></span>
              {{ album.name }}
            </Link>
          </h3>
          <p v-if="album.description" class="mt-2 line-clamp-2 text-sm leading-6 text-gray-300">{{ album.description }}</p>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="albums.links.length > 3" class="mt-16">
        <Pagination :links="albums.links" />
      </div>
    </div>
  </div>
</template>