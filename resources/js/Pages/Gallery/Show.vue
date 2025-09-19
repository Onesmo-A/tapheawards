<script setup>
import { ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

defineOptions({
  layout: DefaultLayout,
});

const props = defineProps({
  album: Object,
});

const lightboxOpen = ref(false);
const currentImage = ref('');

const openLightbox = (post) => {
  currentImage.value = `/storage/${post.featured_image}`;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  currentImage.value = '';
};
</script>

<template>
  <Head>
    <title>{{ album.name }} - Matunzio</title>
    <meta name="description" :content="album.description || `Tazama picha kutoka kwenye albamu ya ${album.name}.`" />
    <meta property="og:title" :content="`${album.name} - Matunzio`" />
    <meta property="og:description" :content="album.description || `Tazama picha kutoka kwenye albamu ya ${album.name}.`" />
    <meta property="og:image" :content="album.cover_image" />
  </Head>

  <div class="bg-background-section pt-24 sm:pt-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mb-12">
        <Link :href="route('gallery.index')" class="inline-flex items-center gap-x-2 text-sm font-semibold text-gold-400 hover:text-gold-300">
          <ArrowLeftIcon class="h-4 w-4" />
          Rudi kwenye Albamu
        </Link>
      </div>

      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ album.name }}</h2>
        <p v-if="album.description" class="mt-4 text-lg leading-8 text-gray-300">{{ album.description }}</p>
      </div>

      <div class="mt-16 columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>div:not(:first-child)]:mt-8">
        <div
          v-for="post in album.posts"
          :key="post.id"
          class="transform cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20"
          @click="openLightbox(post)"
        >
            <img :src="`/storage/${post.featured_image}`" :alt="post.title" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox Modal -->
  <div v-if="lightboxOpen" @click="closeLightbox" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 transition-opacity duration-300">
    <img :src="currentImage" alt="Lightbox Image" class="max-h-full max-w-full rounded-lg" @click.stop />
  </div>
</template>