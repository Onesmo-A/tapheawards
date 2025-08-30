<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
    default: 4000, // mabadiliko ya kila 8 sekunde
  },
});

const heroSlides = computed(() => {
  if (props.slides && props.slides.length > 0) return props.slides;
  return [
    { 
      title: props.title || 'Business Awards 2025',
      description: props.description || 'Celebrating Excellence in Business and Innovation',
      buttons: [
        { text: 'VOTE NOW →', link: '/categories', primary: true },
        { text: 'All Award Winners →', link: '/awards', primary: false },
      ]
    },
  ];
});

const currentIndex = ref(0);
let timer = null;

function next() { currentIndex.value = (currentIndex.value + 1) % heroSlides.value.length; }
function prev() { currentIndex.value = (currentIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length; }
function goTo(i) { currentIndex.value = i % heroSlides.value.length; }
function start() {
  stop();
  if (heroSlides.value.length > 1) {
    timer = setInterval(next, props.rotationMs);
  }
}
function stop() { if (timer) clearInterval(timer); timer = null; }
function handleVisibility() { if (document.hidden) stop(); else start(); }

onMounted(() => {
  start();
  document.addEventListener('visibilitychange', handleVisibility);
});
onUnmounted(() => {
  stop();
  document.removeEventListener('visibilitychange', handleVisibility);
});
</script>

<template>
  <div
    class="relative h-screen flex items-center justify-center overflow-hidden text-white font-sans pt-20 md:pt-28 pb-12"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <!-- Content -->
    <div class="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
      <!-- Text + Buttons -->
      <div class="text-center md:text-left order-2 md:order-1 mt-10 md:mt-16">
        <Transition name="hero-crazy" mode="out-in">
          <div :key="'slide-'+currentIndex">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-title drop-shadow-title">
              <span class="block mt-2 text-primary-gradient">
                {{ heroSlides[currentIndex].title }}
              </span>
            </h1>
            <p class="mt-6 text-base sm:text-lg md:text-xl text-black max-w-xl mx-auto md:mx-0 animate-description drop-shadow-lg">
              {{ heroSlides[currentIndex].description }}
            </p>

            <!-- Buttons -->
            <div class="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start animate-buttons">
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
        <div class="mt-8 flex items-center justify-center md:justify-start gap-4 select-none">
          <button @click="prev" class="h-10 w-10 grid place-items-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 transition">‹</button>
          <div class="flex items-center gap-2">
            <button
              v-for="(s, i) in heroSlides"
              :key="'dot-'+i"
              @click="goTo(i)"
              class="h-3 w-3 rounded-full transition-all border shadow-md"
              :class="i === currentIndex 
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] scale-125' 
                : 'bg-transparent border-red-600 hover:bg-red-500/30'"
            />
          </div>
          <button @click="next" class="h-10 w-10 grid place-items-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 transition">›</button>
        </div>
      </div>

<!-- Trophy Column -->
<div
  class="trophy-container relative flex justify-center
         items-start md:items-end  <!-- Desktop items-end ili iwe chini kidogo -->
         order-1 md:order-2
         h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] md:h-[450px] md:w-[450px]
         mx-auto
         md:translate-y-9"  
>
  <img
    src="/images/trophy1.png"
    alt="Awards Trophy"
    class="w-full h-full object-contain"
  />
</div>

    </div>
  </div>
</template>

<style scoped>
/* Trophy Spin */

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
  animation: descFade 1.5s ease-out;
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
