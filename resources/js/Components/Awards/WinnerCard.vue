<script setup>
defineProps({
  winner: Object
});
</script>

<template>
  <div
    class="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
  >
    <img
      :src="winner.photo"
      :alt="winner.name"
      class="w-full h-48 object-cover"
      loading="lazy"
    />
    <div class="p-4 text-center">
      <h3 class="text-yellow-400 text-lg font-bold">{{ winner.name }}</h3>
      <p class="text-sm text-gray-300">{{ winner.category }}</p>
      <p class="text-xs text-gray-500 mt-1">Year: {{ winner.year }}</p>
    </div>
  </div>
</template>
