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
    class="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl
           bg-gradient-to-br from-red-600/50 via-red-200/30 to-white/20
           text-gray-900 transition-all duration-300
           border border-gray-300/40 hover:border-red-600/50
           hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
  >
    <!-- Optional subtle image -->
    <img
      v-if="category.image_url"
      :src="category.image_url"
      :alt="category.name"
      class="w-full h-full object-cover opacity-5 transition-transform duration-500 ease-in-out group-hover:scale-105"
      loading="lazy"
      decoding="async"
    />

    <!-- Centered Content -->
    <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
      <div class="transition-transform duration-300 group-hover:scale-105">
        <h3 class="text-2xl font-bold text-gray-900 drop-shadow-md">
          {{ category.name }}
        </h3>
        
        <!-- Nominees count -->
        <p v-if="category.nominees_count > 0" class="mt-2">
          <span class="text-3xl font-bold text-red-600 drop-shadow-sm">
            {{ category.nominees_count }}
          </span>
          <span class="ml-1 text-base font-medium text-gray-700">
            Nominee<span v-if="category.nominees_count !== 1">s</span>
          </span>
        </p>
      </div>
    </div>
  </Link>
</template>
