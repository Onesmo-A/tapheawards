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
  <section class="py-20 scroll-mt-20" style="background-color: var(--background-section);">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold leading-7 uppercase">Award Categories</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-primary-gradient">
          Explore and Vote
        </p>
        <p class="mt-6 max-w-2xl mx-auto text-lg leading-8" style="color: var(--text-secondary);">
          Discover outstanding categories and vote for your favorite nominees.
        </p>
      </div>

      <!-- Swiper Carousel -->
      <div class="mt-12 relative pb-10">
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
          navigation
          loop
        >
          <SwiperSlide v-for="(category, index) in categories" :key="index">
            <div
              class="bg-white rounded-2xl shadow-md p-6 h-full flex flex-col justify-between 
                     border-2 border-[var(--accent-primary)]/30 
                     hover:border-[var(--accent-primary)] hover:shadow-2xl hover:scale-105
                     transition-transform transition-shadow transition-border duration-300 relative z-10"
            >
              <h3 class="text-2xl font-bold mb-4">{{ category.name }}</h3>

              <!-- Nominees List -->
              <div class="flex-grow mb-6" v-if="category.nominees && category.nominees.length > 0">
                <div class="flex items-center -space-x-4 rtl:space-x-reverse mb-4">
                  <img
                    v-for="nominee in category.nominees.slice(0, 4)"
                    :key="nominee.id"
                    class="w-14 h-14 rounded-full border-2 border-gray-200 object-cover bg-gray-100"
                    :src="nominee.image_url"
                    :alt="nominee.name"
                  />
                  <div v-if="category.nominees.length > 4"
                       class="flex items-center justify-center w-14 h-14 text-xs font-medium rounded-full border-2 border-gray-200 hover:bg-gray-200"
                       style="color: var(--text-primary); background-color: var(--background-section);">
                    +{{ category.nominees.length - 4 }}
                  </div>
                </div>

                <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
                  <span class="font-bold" style="color: var(--text-accent)">Nominees: </span>
                  <span class="font-bold" style="color: var(--text-primary);">{{ category.nominees.map(n => n.name).join(', ') }}</span>.
                </p>
              </div>

              <!-- Vote Button -->
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
      </div>

      <!-- Button to view all -->
      <div class="mt-0 text-center">
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
.swiper-button-prev,
.swiper-button-next {
  @apply rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg transition-colors text-3xl;
  background-color: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: var(--accent-primary);
  color: var(--background-main);
}

.swiper-button-prev:after,
.swiper-button-next:after {
  content: none !important;
}
</style>
