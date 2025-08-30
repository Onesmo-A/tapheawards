<script setup>
import { Head, router, Link } from '@inertiajs/vue3';
import { defineAsyncComponent, ref, watch } from 'vue';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import debounce from 'lodash/debounce';

const CategoryCard = defineAsyncComponent(() => import('@/Components/Sections/CategoryCard.vue'));

const props = defineProps({
  categoryGroups: Object,
  filters: Object,
});

const loading = ref(false);
const search = ref(props.filters.search);

watch(search, debounce(value => {
  router.get('/categories', { search: value }, {
    preserveState: true,
    replace: true,
    onStart: () => loading.value = true,
    onFinish: () => loading.value = false,
  });
}, 300));
</script>

<template>
<DefaultLayout>
  <Head title="Health Awards Categories" />

  <AppHeader />

  <main class="bg-[var(--background-main)] text-white min-h-screen">
    <!-- Page Header -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center pt-24 sm:pt-32">
        <h2 class="text-base font-semibold leading-7 text-[var(--accent-primary)] uppercase">Our Categories</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight sm:text-6xl text-primary-gradient">
          Discover & Vote
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          Explore all available award categories and cast your vote for the nominees who deserve recognition.
        </p>
      </div>
    </div>

    <!-- Sticky Search Section -->
    <div class="sticky top-20 z-40 bg-[var(--background-section)]/90 backdrop-blur-md border-b border-[var(--accent-primary)]">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-xl py-6">
          <div class="relative">
            <input
              v-model="search"
              type="search"
              name="search"
              id="search"
              class="block w-full rounded-xl bg-gradient-to-r from-red-50/30 via-white/20 to-gray-100/20 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-400 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-[var(--accent-primary)] transition shadow-inner"
              placeholder="Search categories..."
            />

            <!-- Left search icon -->
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            <!-- Right clear button or loader -->
            <div class="absolute inset-y-0 right-3 flex items-center">
              <button
                v-if="search && !loading"
                @click="search=''"
                type="button"
                class="text-gray-400 hover:text-gray-900 focus:outline-none"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Loader -->
              <svg v-if="loading" class="animate-spin h-5 w-5 text-[var(--accent-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 py-16">
      <template v-if="categoryGroups.data && categoryGroups.data.length > 0">
        <div class="space-y-16">
          <section v-for="group in categoryGroups.data" :key="group.id">
            <h2 class="text-2xl font-bold text-[var(--accent-primary)] mb-6 border-l-4 border-[var(--accent-primary)] pl-4">
              {{ group.name }}
            </h2>

            <div v-if="group.children && group.children.length > 0" 
                 class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8 justify-center">
              <CategoryCard 
                v-for="category in group.children" 
                :key="category.id" 
                :category="category" 
                class="transition transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
              />
            </div>
            <div v-else class="text-center text-gray-400 bg-[var(--background-section)]/50 p-6 rounded-xl">
              <p>No awards have been added to this group yet.</p>
            </div>
          </section>
        </div>

        <!-- Pagination -->
        <div v-if="categoryGroups.meta && categoryGroups.meta.last_page > 1" class="mt-16 flex justify-center items-center gap-2">
          <div v-for="(link, key) in categoryGroups.meta.links" :key="key">
            <Link
              v-if="link.url"
              :href="link.url"
              v-html="link.label"
              class="px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-gradient-to-r hover:from-red-600 hover:to-red-400"
              :class="{ 'bg-[var(--accent-primary)] text-black': link.active, 'bg-[var(--background-section)] text-gray-300': !link.active }"
            />
            <span v-else
              v-html="link.label"
              class="px-4 py-2 text-sm font-medium text-gray-500 rounded-full cursor-not-allowed"
            ></span>
          </div>
        </div>
      </template>

      <div v-else class="mx-auto max-w-2xl text-center text-gray-400">
        <p class="text-lg leading-7">No results found. Please try a different keyword.</p>
      </div>
    </div>
  </main>

  <AppFooter />
</DefaultLayout>
</template>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(to right, #ff0000, #b90e0a, #ff3b3b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
