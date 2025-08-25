<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({
  layout: DefaultLayout,
});

const artists = [
  {
    id: 1,
    name: 'Diamond Platnumz',
    image: '/images/artists/diamond.jpg',
    description: 'Tanzania\'s biggest music star performing his latest hits.',
    time: '9:00 PM'
  },
  {
    id: 2,
    name: 'Nandy',
    image: '/images/artists/nandy.jpg',
    description: 'Award-winning artist bringing her electric performance.',
    time: '8:30 PM'
  },
  {
    id: 3,
    name: 'Harmonize',
    image: '/images/artists/harmonize.jpg',
    description: 'Chart-topping performer with an energetic show.',
    time: '8:00 PM'
  }
];
</script>

<template>
  <Head title="Performing Artists" />
  
  <PageHeader 
    title="Performing Artists"
    subtitle="Experience amazing performances at the awards ceremony"
  />

  <section class="py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="artist in artists" 
          :key="artist.id"
          class="group relative overflow-hidden rounded-xl bg-gray-900/50 hover:bg-gray-900/70 transition-colors duration-300"
        >
          <div class="aspect-[3/4] overflow-hidden">
            <img 
              :src="artist.image" 
              :alt="artist.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <div class="translate-y-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p class="text-yellow-400 font-medium mb-2">{{ artist.time }}</p>
              <h3 class="text-xl font-bold text-white mb-2">{{ artist.name }}</h3>
              <p class="text-gray-300 text-sm">{{ artist.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <p class="text-gray-400">
          More artists to be announced soon. Stay tuned!
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-gradient-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
}
</style>