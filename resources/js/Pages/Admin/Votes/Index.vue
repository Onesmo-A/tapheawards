<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, watch, computed } from 'vue';
import debounce from 'lodash/debounce';

// Layout
import AdminLayout from '@/Layouts/AdminLayout.vue';

// Icons
import ExportIcon from '@/Components/Icons/ExportIcon.vue';

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  votes: Object,
  filters: Object,
  categories: Array, // New prop
});

// Filter refs
const search = ref(props.filters.search || '');
const categoryId = ref(props.filters.category_id || '');
const dateFrom = ref(props.filters.date_from || '');
const dateTo = ref(props.filters.date_to || '');

// This computed property will hold all active filters
const activeFilters = computed(() => {
    const filters = {};
    if (search.value) filters.search = search.value;
    if (categoryId.value) filters.category_id = categoryId.value;
    if (dateFrom.value) filters.date_from = dateFrom.value;
    if (dateTo.value) filters.date_to = dateTo.value;
    return filters;
});

// Watch for changes in filters and reload the page
watch(activeFilters, debounce(() => {
  router.get(route('admin.votes.index'), activeFilters.value, {
    preserveState: true,
    replace: true,
  });
}, 300));

// Computed property for the export URL
const exportUrl = computed(() => {
    const url = new URL(route('admin.votes.export.pdf'));
    for (const key in activeFilters.value) {
        url.searchParams.append(key, activeFilters.value[key]);
    }
    return url.href;
});

const formatDate = (datetime) => {
    if (!datetime) return 'N/A';
    return new Date(datetime).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const clearFilters = () => {
    search.value = '';
    categoryId.value = '';
    dateFrom.value = '';
    dateTo.value = '';
};
</script>

<template>
  <Head title="Manage Votes" />

  <div class="p-6 text-gray-100">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gold-gradient">Votes Log</h1>
      <div class="flex items-center space-x-2 md:space-x-3">
        <a :href="exportUrl"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm"
          title="Export to PDF"
          target="_blank"
        >
          <ExportIcon />
          <span class="hidden md:inline ml-2">Export PDF</span>
        </a>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search by Nominee -->
            <div>
                <label for="search" class="block text-sm font-medium text-gray-400 mb-1">Search Nominee</label>
                <input
                    id="search"
                    type="text"
                    v-model="search"
                    placeholder="Search by name..."
                    class="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-900"
                />
            </div>

            <!-- Filter by Category -->
            <div>
                <label for="category" class="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                    id="category"
                    v-model="categoryId"
                    class="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-900"
                >
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <!-- Filter by Date Range -->
            <div>
                <label for="date_from" class="block text-sm font-medium text-gray-400 mb-1">From Date</label>
                <input id="date_from" type="date" v-model="dateFrom" class="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-900" />
            </div>
            <div>
                <label for="date_to" class="block text-sm font-medium text-gray-400 mb-1">To Date</label>
                <input id="date_to" type="date" v-model="dateTo" class="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-900" />
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button @click="clearFilters" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition text-sm">
                Clear Filters
            </button>
        </div>
    </div>

    <div class="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-300 min-w-[700px]">
        <thead class="text-xs text-gold-400 uppercase bg-gray-700/50">
          <tr>
            <th class="px-4 py-3">Nominee</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">IP Address</th>
            <th class="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="votes.data.length === 0">
            <td colspan="4" class="px-4 py-4 text-center text-gray-400">
              No votes found.
            </td>
          </tr>

          <tr
            v-for="vote in votes.data"
            :key="vote.id"
            class="border-b border-gray-700 hover:bg-gray-700/50 transition duration-200"
          >
            <td class="px-4 py-3 text-white font-medium">
              <div class="flex items-center">
                <img v-if="vote.nominee?.image_url" :src="vote.nominee.image_url" :alt="vote.nominee.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                <div v-else class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gold-500 font-bold mr-3">
                  {{ vote.nominee?.name ? vote.nominee.name.charAt(0).toUpperCase() : '?' }}
                </div>
                <span>{{ vote.nominee?.name ?? 'Deleted Nominee' }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-400">{{ vote.nominee?.category?.name ?? 'N/A' }}</td>
            <td class="px-4 py-3 text-gray-400">{{ vote.ip_address }}</td>
            <td class="px-4 py-3 text-gray-400">{{ formatDate(vote.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Links -->
    <div v-if="votes.links.length > 3" class="mt-6 flex justify-center">
      <div class="flex flex-wrap -mb-1">
        <template v-for="(link, key) in votes.links" :key="key">
          <div v-if="link.url === null" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-500 border rounded-md border-gray-700" v-html="link.label" />
          <Link v-else class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded-md border-gray-700 hover:bg-gray-700 focus:border-gold-500 focus:text-gold-500 transition" :class="{ 'bg-gold-500 text-gray-900 font-bold': link.active }" :href="link.url" v-html="link.label" />
        </template>
      </div>
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