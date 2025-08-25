<script setup>
import { useSponsors } from '@/Composables/useSponsors';

const { sponsors } = useSponsors();

// Duplicate sponsors for smooth looping
const topRowSponsors = [...sponsors.value, ...sponsors.value];
const bottomRowSponsors = [...sponsors.value.slice().reverse(), ...sponsors.value.slice().reverse()];
const fastRowSponsors = [...sponsors.value, ...sponsors.value]; // Fast third row
</script>

<template>
  <section 
    class="will-animate-section relative py-20 sm:py-32 text-white overflow-hidden bg-cover bg-center bg-fixed"
    style="background-image: url('/images/backgrounds/sponsors-bg.jpg');"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16 animate-child-on-visible opacity-0" style="transition-delay: 200ms;">
          <h2 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Our Valued Partners</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gold-gradient">
            Proudly Sponsored By
          </p>
        </div>
      </div>

      <!-- Scrolling Sponsors Logos -->
      <div class="relative space-y-8 mt-16 animate-child-on-visible opacity-0" style="transition-delay: 400ms;">
        <!-- Top Row (Scrolls Left to Right) -->
        <div class="scroller" data-direction="right">
          <div class="scroller__inner">
            <img v-for="(sponsor, index) in topRowSponsors" :key="`top-${index}`" :src="sponsor.logo" :alt="sponsor.name" class="h-28 mx-12 object-contain" />
          </div>
        </div>

        <!-- Middle Row (Scrolls Right to Left) -->
        <div class="scroller" data-direction="left">
          <div class="scroller__inner">
            <img v-for="(sponsor, index) in bottomRowSponsors" :key="`bottom-${index}`" :src="sponsor.logo" :alt="sponsor.name" class="h-28 mx-12 object-contain" />
          </div>
        </div>

        <!-- Bottom Row (Scrolls Left to Right FAST) -->
        <div class="scroller fast" data-direction="right">
          <div class="scroller__inner">
            <img v-for="(sponsor, index) in fastRowSponsors" :key="`fast-${index}`" :src="sponsor.logo" :alt="sponsor.name" class="h-28 mx-12 object-contain" />
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
  transform: translateY(0);
  transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000),
              transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible {
  transform: translateY(40px);
}

/* --- Scroller Animation --- */
.scroller {
  max-width: 100%;
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller__inner {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  animation: scroll 60s linear infinite;
}

.scroller[data-direction="right"] .scroller__inner {
  animation-direction: reverse;
}

/* 🎯 Fast row */
.scroller.fast .scroller__inner {
  animation-duration: 20s; /* 3x faster than default */
}

@keyframes scroll {
  to {
    transform: translate(calc(-50%));
  }
}
</style>
