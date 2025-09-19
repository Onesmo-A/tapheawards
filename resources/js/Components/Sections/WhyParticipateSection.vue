<script setup>
import { Link } from '@inertiajs/vue3';

import { ref } from 'vue';
import NominationInfoModal from '@/Components/Modals/NominationInfoModal.vue';

const showModal = ref(false);
</script>

<template>
  <div class="bg-background-section py-20 text-black scroll-mt-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold leading-7 uppercase text-red-600">Why Participate?</h2>
        <p class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl text-primary-gradient">
          TAPHE Awards
        </p>
        <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600">
          Tanzania Peaople'sHealth Excellence Awards celebrate individuals and organizations who are making outstanding contributions to the health sector.  
          From frontline healthcare workers to innovative medical institutions, this is your chance to shine nationally.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <!-- Card 1 -->
        <div
          class="p-8 rounded-2xl border border-red-200 shadow-md bg-gradient-to-b from-white via-gray-100 to-red-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.2s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-700">Recognition</h3>
          <p class="mt-2 text-gray-600">
            Be honored for your dedication in advancing healthcare in Tanzania.  
            Showcase your impact and inspire others in the medical community.
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="p-8 rounded-2xl border border-red-200 shadow-md bg-gradient-to-b from-white via-gray-100 to-red-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.4s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0112 12a10.99 10.99 0 017 4.803" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-700">Collaboration</h3>
          <p class="mt-2 text-gray-600">
            Connect with healthcare leaders, innovators, and institutions.  
            Build lasting partnerships that can transform Tanzania’s health sector.
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="p-8 rounded-2xl border border-red-200 shadow-md bg-gradient-to-b from-white via-gray-100 to-red-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.6s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mx-auto mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-red-700">Impact</h3>
          <p class="mt-2 text-gray-600">
            Boost visibility for your healthcare initiatives.  
            Inspire positive change and motivate future generations of health professionals.
          </p>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="mt-10 flex justify-center flex-col sm:flex-row gap-4 animate-fade-in-up" style="animation-delay: 1s;">
        <Link :href="route('participate')" class="btn-primary">
          Apply for Nominations <span aria-hidden="true">→</span>
        </Link>
        <Link :href="route('tickets.index')" class="btn-secondary">
          Book Tickets <span aria-hidden="true">→</span>
        </Link>
      </div>
      <!-- CTA buttons -->
      <!-- <div class="mt-10 flex justify-center flex-col sm:flex-row gap-4 animate-fade-in-up" style="animation-delay: 1s;">
<button @click="showModal = true"
            class="inline-block rounded-lg bg-red-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-red-700 hover:scale-105">
            Apply Now
          </button>
        <Link :href="route('tickets.index')" class="btn-secondary">
          Book Tickets <span aria-hidden="true">→</span>
        </Link>
      </div> -->

     
    </div>
  </div>
    <NominationInfoModal :show="showModal" @close="showModal = false" />
</template>

<style scoped>
.will-animate {
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>
