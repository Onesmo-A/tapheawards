<script setup>
import { ref } from 'vue';
import NominationInfoModal from '@/Components/Modals/NominationInfoModal.vue';

defineProps({
    title: String,
    dates: String,
});

const showModal = ref(false);
</script>

<template>
  <section class="relative py-16 bg-gray-100">
    <!-- Background Gradient with Diagonal Effect -->
    <div class="absolute inset-0">
      <div class="h-full w-full bg-gradient-to-b from-white via-red-100 to-red-500 clip-diagonal"></div>
    </div>

    <!-- Main Content -->
    <div class="relative container mx-auto px-4">
      <div class="text-center bg-white p-12 rounded-2xl shadow-2xl border border-gray-200">

        <!-- Heading -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-8 drop-shadow-lg">
          {{ title }}
        </h1>
        <h3 class="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl mb-8 " >{{ dates }}</h3>
        <!-- Subheading / Description -->
        <p class="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Wahi sasa! Hii ni fursa yako ya kipekee kushiriki na kupewa heshima kwa juhudi zako.
        </p>

        <!-- Apply Button -->
        <!-- <div>
          <button @click="showModal = true"
            class="inline-block rounded-lg bg-red-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-red-700 hover:scale-105">
            Apply Now
          </button>
        </div> -->
      <!-- Apply Button -->
<div>
  <a href="/login"
     class="btn-primary inline-block rounded-lg bg-red-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-red-700 hover:scale-105 text-center">
    Apply Now
  </a>
</div>

      </div>
    </div>

    <NominationInfoModal :show="showModal" @close="showModal = false" />

  </section>
</template>

<style scoped>
/* Diagonal Background */
.clip-diagonal {
  clip-path: polygon(0 0, 100% 0, 100% 75%, 0% 100%);
}

/* Optional: hide content until Vue compiles */
[v-cloak] { display: none; }
</style>
