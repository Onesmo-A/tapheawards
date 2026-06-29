<script setup>
import { useSponsors } from '@/Composables/useSponsors';

const { sponsors } = useSponsors();
</script>

<template>
  <div class="py-12 bg-black bg-opacity-20">
    <div class="container mx-auto px-6 text-center">
      <h3 class="text-2xl font-bold text-gold-400 mb-6">Wadhamini Wetu</h3>
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        <div v-for="(sponsor, index) in sponsors" :key="sponsor.id || index" class="h-12 md:h-16 flex items-center">
          <img
            :src="sponsor.logo"
            :alt="sponsor.name"
            class="max-h-full grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>
