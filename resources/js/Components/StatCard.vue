<script setup>
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  href: String,
  color: {
    type: String,
    default: 'gray',
  },
});

const colorClasses = computed(() => {
  return {
    gray: 'border-gray-400 hover:shadow-gray-400/40 text-gray-500 bg-gray-100',
    red: 'border-red-400 hover:shadow-red-400/40 text-red-500 bg-red-100',
    yellow: 'border-yellow-400 hover:shadow-yellow-400/40 text-yellow-600 bg-yellow-100',
    green: 'border-green-400 hover:shadow-green-400/40 text-green-600 bg-green-100',
    blue: 'border-blue-400 hover:shadow-blue-400/40 text-blue-600 bg-blue-100',
    indigo: 'border-indigo-400 hover:shadow-indigo-400/40 text-indigo-600 bg-indigo-100',
    purple: 'border-purple-400 hover:shadow-purple-400/40 text-purple-600 bg-purple-100',
    pink: 'border-pink-400 hover:shadow-pink-400/40 text-pink-600 bg-pink-100',
    teal: 'border-teal-400 hover:shadow-teal-400/40 text-teal-600 bg-teal-100',
  }[props.color];
});
</script>

<template>
  <Link
    :href="href"
    class="bg-white border rounded-xl p-5 flex items-center space-x-4 shadow-md transition-all duration-300 transform hover:-translate-y-1"
    :class="colorClasses"
  >
    <div class="p-3 rounded-full" :class="`bg-${color}-100`">
      <slot />
    </div>
    <div>
      <p class="text-sm font-medium" :class="`text-${color}-500`">{{ title }}</p>
      <p class="text-3xl font-bold" :class="`text-${color}-600`">{{ value }}</p>
    </div>
  </Link>
</template>