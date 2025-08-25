<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
  title: String,
  description: String,
  slides: {
    type: Array,
    default: () => [],
  },
  rotationMs: {
    type: Number,
    default: 8000,
  },
});

const heroSlides = computed(() => {
  if (props.slides && props.slides.length > 0) return props.slides;
  return [
    { 
      title: props.title || 'Business Awards 2025',
      description: props.description || '',
      buttons: [
        { text: 'VOTE NOW →', link: '/categories', primary: true },
        { text: 'All Award Winners →', link: '/awards', primary: false },
      ]
    },
  ];
});

const currentIndex = ref(0);
let timer = null;

function next() {
  currentIndex.value = (currentIndex.value + 1) % heroSlides.value.length;
}
function prev() {
  currentIndex.value = (currentIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length;
}
function goTo(i) {
  currentIndex.value = i % heroSlides.value.length;
}
function start() {
  stop();
  if (heroSlides.value.length > 1) {
    timer = setInterval(next, props.rotationMs);
  }
}
function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}
function handleVisibility() {
  if (document.hidden) stop();
  else start();
}

onMounted(() => {
  start();
  document.addEventListener('visibilitychange', handleVisibility);
});
onUnmounted(() => {
  stop();
  document.removeEventListener('visibilitychange', handleVisibility);
});

// Trophy rotation (ile ya awali imebaki)
const currentTrophy = ref(1);
let trophyIntervalId;
onMounted(() => {
  trophyIntervalId = setInterval(() => {
    currentTrophy.value = (currentTrophy.value % 3) + 1;
  }, 8000);
});
onUnmounted(() => clearInterval(trophyIntervalId));
</script>

<template>
  <div
    class="relative h-screen flex items-center justify-center overflow-hidden text-white font-sans py-12 md:py-0"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <!-- Background -->
    <video autoplay loop muted playsinline class="absolute z-0 w-full h-full object-cover" aria-hidden="true">
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-black/60 z-10"></div>

    <!-- Content -->
    <div class="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
      <!-- Text + Buttons -->
      <div class="text-center md:text-left order-2 md:order-1">
        <Transition name="hero-crazy" mode="out-in">
          <div :key="'slide-'+currentIndex">
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-title">
              <span class="block mt-2 text-primary-gradient drop-shadow-glow">
                {{ heroSlides[currentIndex].title }}
              </span>
            </h1>
            <p class="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0 animate-description">
              {{ heroSlides[currentIndex].description }}
            </p>

            <!-- Buttons -->
            <div class="mt-10 flex flex-col md:flex-row gap-4 justify-center md:justify-start animate-buttons">
              <Link
                v-for="(btn, i) in heroSlides[currentIndex].buttons"
                :key="i"
                :href="btn.link"
                :class="btn.primary ? 'btn-primary' : 'btn-secondary'"
              >
                {{ btn.text }}
              </Link>
            </div>
          </div>
        </Transition>

        <!-- Controls -->
        <div class="mt-6 flex items-center justify-center md:justify-start gap-4 select-none">
          <button @click="prev" class="h-10 w-10 grid place-items-center rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition">‹</button>
          <div class="flex items-center gap-2">
            <button
              v-for="(s, i) in heroSlides"
              :key="'dot-'+i"
              @click="goTo(i)"
              class="h-2.5 w-2.5 rounded-full transition-all"
              :class="i === currentIndex ? 'bg-[var(--primary-color)] scale-125' : 'bg-white/40 hover:bg-white/70'"
            />
          </div>
          <button @click="next" class="h-10 w-10 grid place-items-center rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition">›</button>
        </div>
      </div>

      <!-- Trophy Column -->
      <div class="trophy-container relative flex justify-center items-center order-1 md:order-2 h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px]">
        <Transition name="trophy-fade">
          <img
            v-if="currentTrophy === 1" key="trophy1"
            src="/images/trophy1.png" alt="Awards Trophy 1"
            class="absolute w-full h-full object-contain mx-auto md:mx-0 animate-spin-slow-y"
          />
          <img
            v-else-if="currentTrophy === 2" key="trophy2"
            src="/images/trophy2.png" alt="Awards Trophy 2"
            class="absolute w-full h-full object-contain mx-auto md:mx-0 animate-spin-slow-y"
          />
          <img
            v-else-if="currentTrophy === 3" key="trophy3"
            src="/images/trophy3.png" alt="Awards Trophy 3"
            class="absolute w-full h-full object-contain mx-auto md:mx-0 animate-spin-slow-y"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Trophy Spin */
.trophy-container { perspective: 1000px; }
@keyframes spinY-3d {
  0% { transform: rotateY(0deg) rotateX(5deg); }
  50% { transform: rotateY(180deg) rotateX(-5deg); }
  100% { transform: rotateY(360deg) rotateX(5deg); }
}
.animate-spin-slow-y {
  animation: spinY-3d 20s linear infinite;
  transform-style: preserve-3d;
}
.trophy-fade-enter-active,
.trophy-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.trophy-fade-enter-from,
.trophy-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Title Animations */
@keyframes titlePop {
  0% { opacity: 0; transform: translateY(40px) scale(0.95) rotateX(20deg); }
  60% { opacity: 1; transform: translateY(-5px) scale(1.05); }
  100% { transform: translateY(0) scale(1) rotateX(0deg); }
}
.animate-title { animation: titlePop 1.2s cubic-bezier(.22,1.28,.63,1); }

/* Description */
@keyframes descFade {
  0% { opacity: 0; transform: translateX(-40px) skewX(-10deg) scale(1.2); }
  60% { opacity: 1; transform: translateX(5px) skewX(3deg) scale(1.05); }
  100% { opacity: 1; transform: translateX(0) skewX(0) scale(1); }
}
.animate-description { 
  animation: descFade 10s linear infinite alternate;
  animation-fill-mode: backwards;
}

/* Buttons */
@keyframes btnPop {
  0% { opacity: 0; transform: translateY(20px) scale(0.8) rotate(-5deg); }
  70% { opacity: 1; transform: translateY(-4px) scale(1.05) rotate(3deg); }
  100% { transform: translateY(0) scale(1) rotate(0deg); }
}
.animate-buttons {
  animation: btnPop 1.3s cubic-bezier(.2,1.4,.4,1);
}

/* Slide transition wrapper */
.hero-crazy-enter-active,
.hero-crazy-leave-active {
  transition: all 0.9s cubic-bezier(.5,.05,.1,.95);
}
.hero-crazy-enter-from {
  opacity: 0;
  transform: scale(0.9) rotateY(30deg);
}
.hero-crazy-leave-to {
  opacity: 0;
  transform: scale(0.9) rotateY(-30deg);
}
</style>
