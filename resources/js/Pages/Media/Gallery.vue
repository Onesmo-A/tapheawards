<script setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import ImageModal from '@/Components/Common/ImageModal.vue';

defineOptions({
  layout: DefaultLayout,
});

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

const selectedImage = ref(null);
const showModal = ref(false);

const openImage = (image) => {
  selectedImage.value = image;
  showModal.value = true;
};
</script>

<template>
  <Head title="Gallery" />
  
  <PageHeader 
    title="Media Gallery"
    subtitle="Explore moments from our previous events"
    background-image="/images/gallery-header.jpg"
  />

  <section class="py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="group relative aspect-square overflow-hidden rounded-xl bg-gray-900/30 cursor-pointer"
          @click="openImage(image)"
        >
          <img 
            :src="image.url" 
            :alt="image.caption"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-white font-semibold">{{ image.caption }}</h3>
              <p class="text-gray-300 text-sm">{{ image.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Image Modal -->
  <ImageModal 
    v-if="showModal"
    :image="selectedImage"
    @close="showModal = false"
  />
</template>