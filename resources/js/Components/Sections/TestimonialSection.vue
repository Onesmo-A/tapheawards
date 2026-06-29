<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css/core';

defineProps({
  testimonials: Array,
});

const splideOptions = {
  type: 'loop',
  perPage: 2, // BORESHO: Onyesha testimonials mbili kwa wakati mmoja
  perMove: 1,
  autoplay: true,
  interval: 7000,
  pauseOnHover: true,
  arrows: true, // BORESHO: Washa mishale ya navigasheni
  pagination: true,
  gap: '1.5rem', // BORESHO: Ongeza nafasi kati ya slides
  breakpoints: {
    1024: {
      perPage: 1, // Onyesha moja kwenye tablet
      arrows: false, // Ficha mishale kwenye tablet na simu
    },
  },
};
</script>

<template>
  <div v-if="testimonials && testimonials.length > 0" class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-xl text-center">
        <h2 class="text-lg font-semibold leading-8 tracking-tight text-accent-primary">Testimonials</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">What Our Partners Are Saying</p>
      </div>
      <div class="mx-auto mt-16 sm:mt-20">
        <Splide :options="splideOptions" aria-label="Testimonials">
          <SplideSlide v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="pt-8 sm:inline-block sm:w-full h-full flex">
              <figure class="rounded-2xl bg-gray-50 p-8 text-sm leading-6 flex flex-col w-full">
                <blockquote class="text-gray-900">
                  <p>“{{ testimonial.body }}”</p>
                </blockquote>
                <figcaption class="mt-6 flex items-center gap-x-4">
                 <img class="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gray-50" 
     :src="testimonial.author.imageUrl" 
     :alt="testimonial.author.name" />

                  <div>
                    <div class="font-semibold text-gray-900">{{ testimonial.author.name }}</div>
                    <div class="text-gray-600">{{ testimonial.author.role }}</div>
                  </div>
                </figcaption>
              </figure>
            </div>
          </SplideSlide>
        </Splide>
      </div>
    </div>
  </div>
</template>

<style>
.splide__pagination__page.is-active {
  background: var(--accent-primary) !important;
}
.splide__pagination__page {
    background: #ccc;
    width: 12px;
    height: 12px;
    margin: 5px;
}

.splide__arrow {
  background: rgba(0,0,0,0.3);
}
.splide__pagination__page {
    background: #ccc;
    width: 12px;
    height: 12px;
    margin: 5px;
}
</style>