<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from '@inertiajs/vue3';

defineProps({
  categories: Array,
});
</script>

<template>
  <section class="bg-black py-20 text-white scroll-mt-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">Award Categories</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient">
          Explore and Vote
        </p>
        <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-400">
          Discover outstanding categories and vote for your favorite nominees.
        </p>
      </div>

      <!-- Swiper Carousel -->
      <div class="mt-12 relative pb-10"> <!-- padding bottom added here -->
        <Swiper
          :modules="[Navigation, Pagination, Autoplay]"
          :slides-per-view="1"
          :space-between="20"
          :breakpoints="{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }"
          :autoplay="{ delay: 5000 }"          
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          navigation
          loop
        >
          <SwiperSlide v-for="(category, index) in categories" :key="index" class="relative group">

            <div class="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-6 h-full flex flex-col justify-between hover:scale-105 transition-transform relative z-10">
              <h3 class="text-2xl font-bold text-white mb-4">{{ category.name }}</h3>

               <!-- Nominees List -->
        <div class="flex-grow mb-6" v-if="category.nominees && category.nominees.length > 0">
            <!-- Nominee Avatars -->
            <div class="flex items-center -space-x-4 rtl:space-x-reverse mb-4">
 <img
                    v-for="nominee in category.nominees.slice(0, 4)"
                    :key="nominee.id"
                    class="w-14 h-14 rounded-full border-2 border-white/30 object-cover bg-gray-800"
                    :src="nominee.image_url"
                    :alt="nominee.name"
                />
                <div v-if="category.nominees.length > 4" class="flex items-center justify-center w-14 h-14 text-xs font-medium text-white bg-gray-700 rounded-full border-2 border-white/30 hover:bg-gray-600">
                    +{{ category.nominees.length - 4 }}
                </div>
            </div>

            <!-- Nominee Names -->
            <p class="text-sm text-gray-400 leading-relaxed">
                <span class="font-bold" style="color: var(--accent-color)">Nominees: </span>
                <span class="font-bold text-gray-300">{{ category.nominees.map(n => n.name).join(', ') }}</span>.
            </p>
        </div>


              <div class="mt-6">
                <Link
                  :href="route('categories.show', category.slug)"
                  class="btn-primary !w-auto !py-2"
                >
                  Vote Now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Custom Navigation Buttons -->
        <div class="swiper-navigation">
          <button class="swiper-button-prev" aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="swiper-button-next" aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Button to view all -->
      <div class="mt-14 text-center"> <!-- margin top increased here -->
        <Link
          href="/categories"
          class="btn-primary !rounded-full"
        >
          View All Categories
        </Link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.swiper-navigation {
  @apply absolute bottom-[0px] left-1/2 -translate-x-1/2 flex items-center gap-6 z-20;
}

.swiper-button-prev,
.swiper-button-next {
  @apply rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg transition-colors text-white text-3xl;
  background-color: transparent;
  border: 2px solid var(--accent-color);
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: var(--secondary-color);
}

.swiper-button-prev:after,
.swiper-button-next:after {
  content: none !important;
}
</style>
