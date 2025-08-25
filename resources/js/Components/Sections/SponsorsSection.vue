<script setup>
import { useSponsors } from '@/Composables/useSponsors';

const { sponsors } = useSponsors();

// Duplicate logos for smooth loop
const topRow = [...sponsors.value, ...sponsors.value];
const middleRow = [...sponsors.value.slice().reverse(), ...sponsors.value.slice().reverse()];
const bottomRow = [...sponsors.value, ...sponsors.value];
</script>

<template>
  <section
    class="relative py-20 sm:py-32 text-white overflow-hidden bg-cover bg-center bg-fixed"
    style="background-image: url('/images/backgrounds/sponsors-bg.jpg');"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">Our Valued Partners</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient">
            Proudly Sponsored By
          </p>
        </div>

        <!-- SCROLLING ROWS -->
        <div class="space-y-10">
          <!-- Top Row (Right) -->
          <div class="scroller" data-direction="right">
            <div class="scroller__inner">
              <img
                v-for="(sponsor, index) in topRow"
                :key="'top-' + index"
                :src="sponsor.logo"
                :alt="sponsor.name"
                class="h-20 mx-12 object-contain sponsor-logo"
              />
            </div>
          </div>

          <!-- Middle Row (Left) -->
          <div class="scroller" data-direction="left">
            <div class="scroller__inner">
              <img
                v-for="(sponsor, index) in middleRow"
                :key="'middle-' + index"
                :src="sponsor.logo"
                :alt="sponsor.name"
                class="h-20 mx-12 object-contain sponsor-logo"
              />
            </div>
          </div>

          <!-- Bottom Row (Right Fast) -->
          <div class="scroller fast" data-direction="right">
            <div class="scroller__inner">
              <img
                v-for="(sponsor, index) in bottomRow"
                :key="'bottom-' + index"
                :src="sponsor.logo"
                :alt="sponsor.name"
                class="h-20 mx-12 object-contain sponsor-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- Scroller Animation --- */
.scroller {
  overflow: hidden;
  -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
  mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller__inner {
  display: flex;
  width: max-content;
  animation: scroll 60s linear infinite;
}

.scroller[data-direction="right"] .scroller__inner {
  animation-direction: reverse;
}

.scroller[data-direction="left"] .scroller__inner {
  animation-direction: normal;
}

.scroller.fast .scroller__inner {
  animation-duration: 25s; /* Faster */
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.sponsor-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid var(--accent-color, #FFD700); /* Rangi ya outline, unaweza kubadilisha */
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  object-fit: contain;
  display: inline-block;
}

.sponsor-logo:hover {
  border-color: #fff200; /* Rangi ya hover, unaweza kubadilisha */
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transform: scale(1.08);
  z-index: 2;
}
</style>
