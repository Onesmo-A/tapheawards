<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  article: Object,
});
</script>

<template>
  <article
    class="group flex flex-col bg-gray-900/50 rounded-xl overflow-hidden shadow-lg border border-yellow-400/20"
  >
    <div class="relative">
      <img :src="article.image" :alt="article.title" class="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div class="flex flex-col flex-grow p-6">
      <div class="flex-grow">
        <div class="flex justify-between items-center text-sm mb-2">
          <p class="font-semibold text-yellow-400 uppercase">{{ article.category }}</p>
          <time class="text-gray-400">{{ article.date }}</time>
        </div>
        <h3 class="text-xl font-bold text-white leading-tight mb-3">
          <Link :href="article.link" class="hover:text-yellow-300 transition-colors duration-300">{{ article.title }}</Link>
        </h3>
        <p class="text-gray-400 leading-relaxed">{{ article.excerpt }}</p>
      </div>
      <div class="mt-6">
        <Link :href="article.link" class="font-bold text-yellow-400 hover:text-yellow-200 transition-colors duration-300 flex items-center gap-2">
          Read More <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  </article>
</template>
