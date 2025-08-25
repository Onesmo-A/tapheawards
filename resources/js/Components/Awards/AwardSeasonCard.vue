<script setup>
defineProps({
  season: Object
});
</script>

<template>
  <div
    class="rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
  >
    <img
      :src="season.cover"
      :alt="season.theme"
      class="w-full h-48 object-cover"
      loading="lazy"
    />
    <div class="p-4 text-center">
      <h3 class="text-yellow-400 text-xl font-bold">{{ season.year }}</h3>
      <p class="text-sm text-gray-300">{{ season.theme }}</p>
      <inertia-link
        :href="route('seasonAwards.show', season.id)"
        class="mt-3 inline-block text-sm text-yellow-300 underline hover:text-yellow-500 transition"
      >
        View Winners
      </inertia-link>
    </div>
  </div>
</template>
