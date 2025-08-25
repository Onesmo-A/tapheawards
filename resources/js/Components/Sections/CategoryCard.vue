<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <Link
    :href="route('categories.show', category.slug)"
    class="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-900 text-white transition-all duration-300 ring-1 ring-yellow-400/30 hover:ring-2 hover:ring-yellow-400/80 hover:shadow-xl hover:shadow-yellow-500/20"
  >
    <!-- Category Image -->
    <img
      :src="category.image_url"
      :alt="category.name"
      class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      loading="lazy"
      decoding="async"
    />

    <!-- Overlay: dark background and slight gradient -->
    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/80 transition-colors duration-300"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

    <!-- Centered Content -->
    <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
      <div class="transition-transform duration-300 group-hover:scale-105">
        <h3 class="text-2xl font-bold text-white drop-shadow-md">
          {{ category.name }}
        </h3>
        
        <!-- Nominees count with new styling -->
        <p v-if="category.nominees_count > 0" class="mt-2">
          <span class="text-3xl font-bold text-yellow-400 drop-shadow-md">{{ category.nominees_count }}</span>
          <span class="ml-1.5 text-base font-medium text-gray-200">Nominee<span v-if="category.nominees_count !== 1">s</span></span>
        </p>
      </div>
    </div>
  </Link>
</template>
