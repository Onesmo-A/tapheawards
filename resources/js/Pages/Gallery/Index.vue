<script setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import ImageModal from '@/Components/ImageModal.vue';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    description: String,
    galleryItems: Object,
});

const showingImage = ref(null);

const showImage = (item) => {
    showingImage.value = item;
};

const closeImageModal = () => {
    showingImage.value = null;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
    });
};
</script>

<template>
  <Head :title="title" />

  <PageHeader 
    title="Event Moments"
    :subtitle="description"
  />

  <main class="bg-background-section">
    <div class="py-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div v-if="galleryItems && galleryItems.data.length > 0" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div v-for="item in galleryItems.data" :key="item.id" @click="showImage(item)" class="group relative aspect-w-1 aspect-h-1 cursor-pointer overflow-hidden rounded-lg bg-gray-200 shadow-lg">
                <img :src="item.featured_image_url" :alt="item.title" class="h-full w-full object-cover object-center transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75" />
                <div class="absolute bottom-0 left-0 p-2">
                    <time class="text-xs font-medium text-white bg-black bg-opacity-40 rounded px-1.5 py-0.5 transition-opacity duration-300 opacity-80 group-hover:opacity-100">{{ formatDate(item.published_at) }}</time>
                </div>
            </div>
        </div>
        
        <div v-else class="text-center text-gray-500">
          <p>No pictures or videos have been posted yet. Please check back later.</p>
        </div>
      </div>
    </div>
  </main>

  <ImageModal 
    :show="showingImage !== null" 
    :image-url="showingImage?.featured_image_url" 
    :alt-text="showingImage?.title"
    @close="closeImageModal"
  />
</template>