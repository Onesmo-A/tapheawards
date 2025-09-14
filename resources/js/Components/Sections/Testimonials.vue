<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

const testimonials = [
  {
    name: 'Dr. Amina Juma',
    role: 'Health Expert',
    photo: '/images/testimonials/dr-amina.jpg',
    message: 'TAPHE Awards is a great initiative recognizing health excellence in Tanzania!'
  },
  {
    name: 'John Mwangi',
    role: 'Participant',
    photo: '/images/testimonials/john.jpg',
    message: 'Voting was seamless and the experience was very engaging. Highly recommend!'
  },
  {
    name: 'Mary Kimaro',
    role: 'Industry Leader',
    photo: '/images/testimonials/mary.jpg',
    message: 'This platform truly celebrates innovation and dedication in the healthcare sector.'
  }
];
</script>

<template>
  <section id="testimonials" class="py-20 bg-background-section scroll-mt-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-base font-semibold uppercase text-text-accent">Testimonials</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-primary-gradient">
          What People Are Saying
        </p>
      </div>

      <Swiper
        :slides-per-view="1"
        :space-between="20"
        :breakpoints="{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
        loop
        autoplay="{ delay: 6000 }"
      >
        <SwiperSlide
          v-for="(testimonial, index) in testimonials"
          :key="index"
        >
          <div class="bg-background-main rounded-2xl p-8 shadow-lg text-center flex flex-col items-center h-full">
            <img :src="testimonial.photo" :alt="testimonial.name" class="w-20 h-20 rounded-full mb-4 object-cover border-2 border-[var(--accent-primary)]" />
            <p class="text-text-secondary italic mb-4">"{{ testimonial.message }}"</p>
            <h3 class="text-lg font-bold text-text-primary">{{ testimonial.name }}</h3>
            <span class="text-sm text-text-accent">{{ testimonial.role }}</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
