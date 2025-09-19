<script setup>
import { Head, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import { CameraIcon } from '@heroicons/vue/24/solid';

defineOptions({
  layout: DefaultLayout,
});

const props = defineProps({
  albums: Object,
  title: String,
  description: String,
});
</script>

<template>
  <Head>
    <title>{{ title }}</title>
    <meta name="description" :content="description" />
    <meta property="og:title" :content="title" />
    <meta property="og:description" :content="description" />
  </Head>

  <div class="bg-background-section pt-24 pb-12 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- Sehemu ya Kichwa na Maelezo -->
      <div class="mx-auto max-w-2xl text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-primary-gradient sm:text-4xl">{{ title }}</h2>
        <p class="mt-4 text-lg leading-8 text-gray-600">{{ description }}</p>
      </div>

      <!-- Gridi ya Albamu -->
      <div v-if="albums.data.length > 0" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <Link
          v-for="album in albums.data"
          :key="album.id"
          :href="route('gallery.show', album.slug)"
          class="group relative transform overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div class="aspect-h-3 aspect-w-4 w-full overflow-hidden">
            <img
              :src="album.cover_image_url || '/images/placeholder.png'"
              :alt="album.name"
              class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-lg font-semibold text-white">{{ album.name }}</h3>
            <div class="mt-1 flex items-center text-sm text-gray-300">
              <CameraIcon class="h-5 w-5 mr-1.5 flex-shrink-0" />
              <span>{{ album.posts_count }} Picha</span>
            </div>
          </div>
        </Link>
      </div>
      <div v-else class="text-center text-gray-500">
          <p>Hakuna albamu zilizochapishwa kwa sasa.</p>
      </div>

      <!-- Pagination -->
      <div v-if="albums.links.length > 3" class="mt-12">
        <Pagination :links="albums.links" />
      </div>
    </div>
  </div>
</template>