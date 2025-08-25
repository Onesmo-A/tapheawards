<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

// Icons
import BackIcon from '@/Components/Icons/BackIcon.vue';
import ExportIcon from '@/Components/Icons/ExportIcon.vue';

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  category: Object,
  nominees: Array,
});

const getOrdinalSuffix = (i) => {
    const j = i % 10,
          k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
};
</script>

<template>
  <Head :title="`Results for ${category.name}`" />

  <div class="p-6 text-gray-100">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gold-gradient">Results: {{ category.name }}</h1>
        <p class="text-gray-400 mt-1">{{ category.description }}</p>
      </div>
      <div class="flex items-center space-x-2 md:space-x-3">
        <a
          :href="route('admin.categories.export.pdf', category.id)"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm"
          title="Export Results to PDF"
          target="_blank"
        >
          <ExportIcon />
          <span class="hidden md:inline ml-2">Export PDF</span>
        </a>
        <Link
          :href="route('admin.categories.index')"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition text-sm"
        >
          <BackIcon class="w-5 h-5" />
          <span class="hidden md:inline ml-2">Back to Categories</span>
        </Link>
      </div>
    </div>

    <div class="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-300 min-w-[600px]">
        <thead class="text-xs text-gold-400 uppercase bg-gray-700/50">
          <tr>
            <th class="px-4 py-3 w-16 text-center">Rank</th>
            <th class="px-4 py-3">Nominee</th>
            <th class="px-4 py-3 text-right">Votes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="nominees.length === 0">
            <td colspan="3" class="px-4 py-4 text-center text-gray-400">
              No nominees found in this category.
            </td>
          </tr>

          <tr
            v-for="(nominee, index) in nominees"
            :key="nominee.id"
            class="border-b border-gray-700 hover:bg-gray-700/50 transition duration-200"
            :class="{ 'bg-gold-500/10': index === 0, 'bg-gray-500/10': index === 1, 'bg-yellow-800/10': index === 2 }"
          >
            <td class="px-4 py-3 text-center">
              <span class="font-bold text-lg" :class="{'text-gold-400': index === 0, 'text-gray-300': index === 1, 'text-yellow-600': index === 2}">
                {{ index + 1 }}<sup>{{ getOrdinalSuffix(index + 1) }}</sup>
              </span>
            </td>
            <td class="px-4 py-3 text-white font-medium">
              <div class="flex items-center">
                <img
                  v-if="nominee.image_url"
                  :src="nominee.image_url"
                  :alt="nominee.name"
                  class="h-10 w-10 rounded-full object-cover mr-4"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-500 font-bold mr-4"
                >
                  {{ nominee.name ? nominee.name.charAt(0).toUpperCase() : '?' }}
                </div>
                <span>{{ nominee.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right text-white font-semibold text-lg">
              {{ nominee.votes_count.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #D4AF37, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>