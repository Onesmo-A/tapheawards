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
    default: 5000,
  },
});

const heroSlides = computed(() => {
  if (props.slides && props.slides.length > 0) return props.slides;

  return [
    {
      title: props.title || 'Business Awards 2025',
      description: props.description || 'Celebrating excellence in leadership, service, and innovation.',
      imageUrl: '/images/hero/slide-1.png',
      buttons: [
        { text: 'VOTE NOW', link: '/categories', primary: true },
        { text: 'All Award Winners', link: '/awards', primary: false },
      ],
      badge: 'Slide 01',
    },
  ];
});

const currentIndex = ref(0);
let timer = null;

const activeSlide = computed(() => heroSlides.value[currentIndex.value] || heroSlides.value[0] || {});

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
</script>

<template>
  <section
    class="relative overflow-hidden text-white"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <div class="absolute inset-0 bg-[#06101d]"></div>
    <Transition name="hero-bg" mode="out-in">
      <div
        :key="'bg-'+currentIndex"
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${activeSlide.imageUrl || '/images/hero/slide-1.png'})` }"
      ></div>
    </Transition>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(197,48,48,0.14),_transparent_28%),linear-gradient(180deg,_rgba(6,16,29,0.30),_rgba(6,16,29,0.55))]"></div>
    <div class="absolute inset-0 opacity-15 mix-blend-soft-light bg-[linear-gradient(135deg,_rgba(255,255,255,0.06)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.06)_50%,_rgba(255,255,255,0.06)_75%,_transparent_75%,_transparent)] bg-[length:48px_48px]"></div>
    <div class="absolute left-[-8rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl"></div>
    <div class="absolute right-[-8rem] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-white/10 blur-3xl"></div>

    <div class="relative z-10 mx-auto min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-7.5rem)] max-w-7xl px-6 pb-16 pt-24 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-14 lg:pt-28">
      <div class="flex h-full flex-col justify-end">
        <div class="w-full text-center lg:max-w-3xl lg:text-left">
          <Transition name="hero-luxury" mode="out-in">
          <div :key="'text-'+currentIndex">
            <h1 class="mt-6 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
              <span class="block bg-gradient-to-r from-white via-gold-100 to-gold-400 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                {{ activeSlide.title }}
              </span>
            </h1>

            <p class="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 lg:mx-0 lg:text-xl">
              {{ activeSlide.description }}
            </p>

            <div class="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:flex-row lg:justify-start">
              <Link
                v-for="(btn, i) in activeSlide.buttons"
                :key="i"
                :href="btn.link"
                :class="btn.primary ? 'btn-primary' : 'btn-secondary'"
                class="!w-auto !min-w-0 !px-4 !py-2.5 !text-sm sm:!px-5 sm:!py-3"
              >
                {{ btn.text }}
              </Link>
            </div>
          </div>
        </Transition>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3 lg:mt-12 lg:justify-start">
          <button @click="prev" class="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20">‹</button>
          <div class="flex items-center gap-2">
            <button
              v-for="(slide, i) in heroSlides"
              :key="`dot-${i}`"
              @click="goTo(i)"
              class="h-2.5 w-6 sm:w-8 rounded-full border transition-all"
              :class="i === currentIndex ? 'border-gold-400 bg-gold-400' : 'border-white/20 bg-white/10 hover:bg-white/25'"
            />
          </div>
          <button @click="next" class="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20">›</button>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-luxury-enter-active,
.hero-luxury-leave-active {
  transition: all 0.9s cubic-bezier(.5,.05,.1,.95);
}
.hero-luxury-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.hero-luxury-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.hero-bg-enter-active,
.hero-bg-leave-active {
  transition: opacity 0.9s ease;
}
.hero-bg-enter-from,
.hero-bg-leave-to {
  opacity: 0;
}
</style>
