<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import VoteButton from '@/Components/VoteButton.vue';

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  nominee: Object,
  category: Object
});
</script>

<template>
  <Head :title="nominee.name" />

  <div class="pt-32 pb-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Nominee Image -->
        <div class="relative">
          <img 
            :src="nominee.image_url" 
            :alt="nominee.name"
            class="rounded-xl shadow-2xl w-full aspect-[4/3] object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
        </div>

        <!-- Nominee Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-4xl font-bold text-white">{{ nominee.name }}</h1>
            <p class="text-yellow-400 mt-2">{{ category.name }}</p>
          </div>

          <div class="prose prose-lg prose-invert">
            <p>{{ nominee.bio }}</p>
          </div>

          <VoteButton 
            :nominee="nominee"
            class="mt-8"
          />
        </div>
      </div>
    </div>
  </div>
</template>