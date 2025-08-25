<template>
  <div class="py-12 bg-black bg-opacity-20">
    <div class="container mx-auto px-6 text-center">
      <h3 class="text-2xl font-bold text-gold-400 mb-6">Wadhamini Wetu</h3>
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        <div v-for="(sponsor, index) in sponsors" :key="index" class="h-12 md:h-16 flex items-center">
          <img
            :src="`/images/sponsors/${sponsor}`"
            :alt="`Sponsor ${index + 1}`"
            class="max-h-full grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const sponsors = [
  'GANZI.jpg',
  'jeziOriginal.jpg',
  'MAKUNDUCHI.jpg',
  'MQ.jpg',
  'NIVES TRENDS.jpg',
  'PRO SHARE.jpg',
  'SPONSORS-CROWN-MEDIA.jpg',
  'simuhadhiYako.jpg',
  'SPONSORS1.jpg',
  'SPONSORS BAR.jpg',
  'SPONSORS-DOLLY.jpg',
  'SPONSORS GAZEM.jpg',
  'SPONSORS-jay.jpg',
  'SPONSORSkim.jpg',
  'SPONSORS-STOCK.jpg'
];
</script>
