<script setup>
import { Head, router, Link } from '@inertiajs/vue3';
import { defineAsyncComponent, ref, watch } from 'vue';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import debounce from 'lodash/debounce';

const CategoryCard = defineAsyncComponent(() => import('@/Components/Sections/CategoryCard.vue'));

const props = defineProps({
  categoryGroups: Object,
  filters: Object,
});

// Search functionality
const loading = ref(false);
const search = ref(props.filters.search);
watch(search, debounce(value => {
  router.get('/categories', { search: value }, {
    preserveState: true,
    replace: true,
    onStart: () => {
      loading.value = true;
    },
    onFinish: () => {
      loading.value = false;
    },
  });
}, 300)); // Wait 300ms before executing search
</script>

<template>
  <Head title="Award Categories" />

  <AppHeader />

  <main class="bg-black text-white">
    <!-- Page Header -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center pt-24 sm:pt-32">
        <h2 class="text-base font-semibold leading-7 text-red-400 uppercase">Our Categories</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl text-red-gradient">
          Discover & Vote
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Explore all available award categories and cast your vote for the nominees you believe deserve the recognition.
        </p>
      </div>
    </div>

    <!-- Sticky Search Section -->
    <div class="sticky top-20 z-40 bg-black/80 backdrop-blur-lg">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-xl py-6">
          <div class="relative group">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="search"
              type="search"
              name="search"
              id="search"
              class="block w-full rounded-md border-0 bg-white/5 py-2.5 pl-10 pr-10 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
              placeholder="Search categories..."
            />
            <div v-if="search" class="absolute inset-y-0 right-0 flex items-center">
              <button @click="search = ''" type="button" class="p-2 text-gray-400 hover:text-white focus:outline-none" aria-label="Clear search">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="pb-24 sm:pb-32">
        <!-- Categories Grid -->
        <template v-if="categoryGroups.data && categoryGroups.data.length > 0">
          <div class="mt-12 space-y-16">
            <!-- First loop: Main Groups -->
            <section v-for="group in categoryGroups.data" :key="group.id">
              <h2 class="text-2xl font-bold text-red-400 mb-6 border-l-4 border-red-500 pl-4">
                {{ group.name }}
              </h2>

              <!-- Grid of Awards under Main Group -->
              <div v-if="group.children && group.children.length > 0" class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <!-- Second loop: Specific Awards (children) -->
                <CategoryCard v-for="category in group.children" :key="category.id" :category="category" />
              </div>
              <div v-else class="text-center text-gray-500 bg-gray-900/50 p-6 rounded-lg">
                <p>No awards have been added to this group yet.</p>
              </div>
            </section>
          </div>

          <!-- Pagination Links -->
          <div v-if="categoryGroups.meta && categoryGroups.meta.last_page > 1" class="mt-16 flex justify-center items-center space-x-1">
            <div v-for="(link, key) in categoryGroups.meta.links" :key="key">
              <Link
                  v-if="link.url"
                  :href="link.url"
                  v-html="link.label"
                  class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  :class="{ 'bg-red-400 text-black': link.active, 'bg-gray-800 text-gray-300 hover:bg-gray-700': !link.active }"
              />
              <span v-else
                  v-html="link.label"
                  class="px-4 py-2 text-sm font-medium text-gray-500 rounded-md cursor-not-allowed"
              ></span>
            </div>
          </div>
        </template>

        <!-- No Results -->
        <div v-else class="mx-auto mt-16 max-w-2xl text-center">
          <p class="text-lg leading-7 text-gray-300">
            No results found. Please try a different keyword.
          </p>
        </div>
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.text-red-gradient {
  background: linear-gradient(to right, #ff0000, #600202, #ef2828);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
