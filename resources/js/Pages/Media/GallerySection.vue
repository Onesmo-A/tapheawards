<script setup>
// Data for gallery images. The 'class' property controls the size in the grid.
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
    <section class="will-animate-section bg-black py-20 sm:py-32 text-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms;">
                <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Event Highlights</h2>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
                    Moments From Previous Awards
                </p>
            </div>

            <!-- Masonry-style Gallery Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4">
                <div
                    v-for="(image, index) in galleryImages"
                    :key="index"
                    :class="image.class"
                    class="group relative overflow-hidden rounded-xl shadow-lg animate-child-on-visible opacity-0"
                    :style="{ 'transition-delay': (400 + index * 100) + 'ms' }"
                >
                    <img :src="image.src" :alt="image.alt" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                        <div class="p-4 bg-yellow-400/80 rounded-full backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
.text-gold-gradient {
  background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
    transform: scale(0.95);
    opacity: 0;
}
</style>