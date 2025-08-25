<script setup>
import { Link } from '@inertiajs/vue3';
</script>

<template>
  <div class="bg-black py-20 text-white scroll-mt-20">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Why Participate?</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
          Elevate Your Brand
        </p>
        <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-400">
          Gain recognition, build credibility, and connect with industry leaders. The Tanzania Business Awards is more than an event; it's a platform for growth.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <!-- Card 1 -->
        <div
          class="p-8 bg-black rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-500/10 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.2s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gold-gradient mx-auto mb-6">
            <svg class="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Recognition</h3>
          <p class="mt-2 text-gray-400">Be recognized as a leader in your industry and showcase your achievements on a national stage.</p>
        </div>

        <!-- Card 2 -->
        <div
          class="p-8 bg-black rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-500/10 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.4s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gold-gradient mx-auto mb-6">
            <svg class="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0112 12a10.99 10.99 0 017 4.803" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Networking</h3>
          <p class="mt-2 text-gray-400">Connect with top executives, entrepreneurs, and investors from across Tanzania.</p>
        </div>

        <!-- Card 3 -->
        <div
          class="p-8 bg-black rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-500/10 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 will-animate animate-fade-in-up"
          style="animation-delay: 0.6s;"
        >
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-gold-gradient mx-auto mb-6">
            <svg class="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Growth</h3>
          <p class="mt-2 text-gray-400">Boost your brand's visibility, attract talent, and open doors to new business opportunities.</p>
        </div>
      </div>

      <div class="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style="animation-delay: 1s;">
        <Link :href="route('participate')"
          class="bg-gold-gradient text-white font-bold py-3 px-8 rounded-md shadow-lg shadow-yellow-500/30 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400 transition-all duration-300">
          Apply forvrrrr
        </Link>
        <Link :href="route('tickets.index')"
          class="bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-md hover:bg-yellow-400 hover:text-black transition-all duration-300">
          Book Tickets <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  </div>
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
