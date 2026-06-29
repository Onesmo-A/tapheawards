<script setup>
import { Head, router, Link } from '@inertiajs/vue3';
import { defineAsyncComponent, ref, watch } from 'vue';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import debounce from 'lodash/debounce';

const CategoryCard = defineAsyncComponent(() => import('@/Components/Sections/CategoryCard.vue'));

const props = defineProps({
  categoryGroups: Object,
  filters: Object,
  stats: Object,
});

const search = ref(props.filters.search || '');

const runSearch = debounce((value) => {
  router.get(route('categories.index'), { search: value }, {
    preserveState: true,
    replace: true,
    only: ['categoryGroups', 'filters', 'stats'],
  });
}, 300);

watch(search, (value) => {
  runSearch(value.trimStart());
});

const clearSearch = () => {
  search.value = '';
  router.get(route('categories.index'), {}, {
    preserveState: true,
    replace: true,
    only: ['categoryGroups', 'filters', 'stats'],
  });
};
</script>

<template>
<DefaultLayout>
  <Head title="Health Awards Categories" />

  <AppHeader />

  <main class="bg-[var(--background-main)] text-white min-h-screen">
    <section class="section-white-luxe relative pt-28 pb-14 sm:pt-32 sm:pb-16">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,48,48,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),_transparent_24%),linear-gradient(180deg,_rgba(6,16,29,0.04),_rgba(6,16,29,0.02))]"></div>
      <div class="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div class="max-w-3xl">
            <p class="inline-flex items-center rounded-full border border-red-500/15 bg-red-500/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-700">
              Explore & Vote
            </p>
            <h1 class="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
              <span class="block bg-gradient-to-r from-red-700 via-red-500 to-red-800 bg-clip-text text-transparent">
                Discover Categories
              </span>
            </h1>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="panel-red-glass-soft rounded-2xl p-4 text-center">
              <p class="text-2xl font-black text-red-700">{{ props.stats?.groups ?? 0 }}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Groups</p>
            </div>
            <div class="panel-red-glass-soft rounded-2xl p-4 text-center">
              <p class="text-2xl font-black text-red-700">{{ props.stats?.awards ?? 0 }}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Awards</p>
            </div>
            <div class="panel-red-glass-soft rounded-2xl p-4 text-center">
              <p class="text-2xl font-black text-red-700">{{ props.stats?.nominees ?? 0 }}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Nominees</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <div class="sticky top-24 z-20 border-y border-red-500/10 bg-white/80 backdrop-blur-xl shadow-sm">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl py-5">
          <div class="relative">
            <input
              v-model="search"
              type="search"
              name="search"
              id="search"
              class="block w-full rounded-2xl border border-red-500/10 bg-white py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 shadow-[0_12px_35px_rgba(197,48,48,0.08)] outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-200"
              placeholder="Search by category, award, description or nominee..."
            />

            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            <div class="absolute inset-y-0 right-3 flex items-center gap-2">
              <button
                v-if="search"
                @click="clearSearch"
                type="button"
                class="rounded-full bg-gray-100 p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-700"
              >
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <template v-if="categoryGroups.data && categoryGroups.data.length > 0">
        <div class="space-y-16">
          <section v-for="group in categoryGroups.data" :key="group.id">
            <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 class="text-2xl font-black text-gray-900 sm:text-3xl">
                  {{ group.name }}
                </h2>
                <p v-if="group.description" class="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                  {{ group.description }}
                </p>
              </div>
              <div class="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                {{ group.children?.length || 0 }} awards
              </div>
            </div>

            <div v-if="group.children && group.children.length > 0" 
                 class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6 justify-center">
              <CategoryCard 
                v-for="category in group.children" 
                :key="category.id" 
                :category="category" 
                class="transition transform hover:-translate-y-1 hover:shadow-2xl"
              />
            </div>
            <div v-else class="text-center text-gray-500 panel-red-glass-soft p-6 rounded-2xl">
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
              class="px-4 py-2 text-sm font-semibold rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
              :class="{ 'bg-red-600 text-white shadow-red-500/20': link.active, 'bg-white text-gray-700 border border-red-100 hover:bg-red-50': !link.active }"
            />
            <span v-else
              v-html="link.label"
              class="px-4 py-2 text-sm font-medium text-gray-500 rounded-full cursor-not-allowed"
            ></span>
          </div>
        </div>
      </template>

      <div v-else class="mx-auto max-w-2xl text-center panel-red-glass-soft rounded-3xl p-10 text-gray-700">
        <p class="text-lg font-semibold leading-7 text-gray-900">No results found.</p>
        <p class="mt-2 text-sm leading-7 text-gray-600">Jaribu jina tofauti, sehemu ya description, au nominee aliye ndani ya category.</p>
        <button
          v-if="search"
          @click="clearSearch"
          type="button"
          class="mt-6 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-red-500"
        >
          Clear search
        </button>
      </div>
    </div>
  </main>
</DefaultLayout>
</template>

<style scoped>
.text-primary-gradient {
  background: linear-gradient(to right, #ff0000, #b90e0a, #ff3b3b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
