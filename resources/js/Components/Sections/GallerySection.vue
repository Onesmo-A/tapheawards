<script setup>
const galleryImages = [
  { src: '/images/gallery/event-1.jpeg', alt: 'Excited audience at the awards', class: 'col-span-2 row-span-2' },
  { src: '/images/gallery/event-2.jpeg', alt: 'Winner receiving a trophy', class: 'col-span-1 row-span-1' },
  { src: '/images/gallery/event-3.jpeg', alt: 'Live performance on stage', class: 'col-span-1 row-span-1' },
  { src: '/images/gallery/event-4.jpeg', alt: 'Networking session during the event', class: 'col-span-1 row-span-1' },
  { src: '/images/gallery/event-5.jpg', alt: 'Red carpet arrivals', class: 'col-span-1 row-span-1' },
  { src: '/images/gallery/event-6.jpg', alt: 'Panel discussion with industry leaders', class: 'col-span-2 row-span-1' },
];
</script>

<template>
  <section id="gallery" class="will-animate-section scroll-mt-20 overflow-hidden bg-background-section py-20 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mb-16 text-center" style="transition-delay: 200ms;">
        <h2 class="text-base font-semibold uppercase leading-7 text-text-accent">Event Highlights</h2>
        <p class="text-primary-gradient mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
         Gallery Highlights
        </p>
      </div>

      <div class="grid auto-rows-[250px] grid-cols-2 gap-4 md:grid-cols-4">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          :class="image.class"
          class="group relative overflow-hidden rounded-xl shadow-lg"
          :style="{ 'transition-delay': (400 + index * 100) + 'ms' }"
        >
          <img :src="image.src" :alt="image.alt" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div> <!-- Subtle shadow at the bottom -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div class="rounded-full bg-[var(--accent-primary)]/80 p-4 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
