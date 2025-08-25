<script setup>
import { Head, Link, router } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { computed, ref, watch } from 'vue';
import Pagination from '@/Components/Pagination.vue';

defineOptions({
  layout: DefaultLayout,
});

const props = defineProps({
    title: String,
    description: String,
    winnersByYear: Object, // Data iliyopangwa kwa mwaka (default view)
    searchedWinners: Object, // Data ya utafutaji yenye pagination
    showWinners: Boolean,
    filters: Object, // Vichujio vya sasa, kama 'search'
});

// A computed property to check if there are any winners to display
const hasWinnersByYear = computed(() => {
    return props.winnersByYear && Object.keys(props.winnersByYear).length > 0;
});

const search = ref(props.filters.search);

// Function ya debounce kuzuia kutuma request kwa kila herufi
const debounce = (fn, delay) => {
  let timeoutID = null;
  return function (...args) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => fn(...args), delay);
  };
};

// Tumia watch na debounce kutuma request baada ya mtumiaji kumaliza kuandika
watch(search, debounce((value) => {
    router.get(route('awards.index'), { search: value }, {
        preserveState: true,
        replace: true,
    });
}, 300));
</script>

<template>
    <Head>
        <title>{{ title }}</title>
        <meta name="description" :content="description" />
    </Head>

    <main>
        <!-- Header Section -->
        <section class="pt-32 pb-16 bg-gradient-to-b from-gray-900 to-black text-white">
            <div class="text-center max-w-7xl mx-auto px-6 lg:px-8">
                <h1 class="text-base font-semibold leading-7 text-yellow-400 uppercase">Hall of Fame</h1>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl text-gold-gradient drop-shadow-glow">
                    {{ title }}
                </p>
                <p class="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
                    {{ description }}
                </p>
            </div>
        </section>

        <!-- Search Section -->
        <section class="bg-black pb-10 -mt-8">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="max-w-lg mx-auto">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search winners by name or category..."
                        class="w-full px-5 py-3 bg-gray-800/50 text-white border-2 border-gray-700 rounded-full focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 placeholder-gray-500"
                    >
                </div>
            </div>
        </section>

        <!-- Search Section -->
        <section class="bg-black pb-10 -mt-8">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div class="max-w-lg mx-auto">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search winners by name or category..."
                        class="w-full px-5 py-3 bg-gray-800/50 text-white border-2 border-gray-700 rounded-full focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300 placeholder-gray-500"
                    >
                </div>
            </div>
        </section>

        <!-- Winners Section -->
        <section class="bg-black py-10">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <!-- SEARCH RESULTS VIEW -->
                <div v-if="filters.search">
                    <div v-if="searchedWinners && searchedWinners.data.length > 0">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <div v-for="winner in searchedWinners.data" :key="winner.id" class="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-yellow-500/20">
                                <img :src="winner.nominee.image_url" :alt="winner.nominee.name" class="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 mb-4">
                                <h3 class="text-xl font-bold text-white">{{ winner.nominee.name }}</h3>
                                <p class="text-yellow-400 font-semibold mt-1">{{ winner.category.name }}</p>
                                <p class="text-gray-500 text-xs mt-1">YEAR {{ winner.year }}</p>
                                <p class="text-gray-400 text-sm mt-3 flex-grow line-clamp-3">{{ winner.nominee.bio }}</p>

                                <div class="mt-4 pt-4 border-t border-yellow-400/10 w-full">
                                    <Link
                                        :href="route('awards.results.category', { year: winner.year, category: winner.category.slug })"
                                        class="text-sm font-semibold text-yellow-500 hover:text-yellow-300 transition-colors duration-200">
                                        View Full Results
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div class="mt-16">
                            <Pagination :links="searchedWinners.links" />
                        </div>
                    </div>
                    <div v-else class="text-center py-16">
                        <div class="bg-gray-900/50 inline-block p-8 rounded-lg shadow-xl">
                            <h3 class="text-2xl font-bold text-yellow-400">No Results Found</h3>
                            <p class="mt-4 text-gray-400 max-w-lg mx-auto">
                                We couldn't find any winners matching your search for "{{ filters.search }}".
                            </p>
                        </div>
                    </div>
                </div>

                <!-- DEFAULT VIEW (GROUPED BY YEAR) -->
                <div v-else>
                    <div v-if="showWinners && hasWinnersByYear">
                        <div v-for="(winners, year) in winnersByYear" :key="year" class="mb-16 last:mb-0">
                            <h2 class="text-3xl font-bold text-yellow-400 border-b-2 border-gray-700 pb-4 mb-8">
                                Year {{ year }}
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                <div v-for="winner in winners" :key="winner.id" class="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-yellow-500/20">
                                    <img :src="winner.nominee.image_url" :alt="winner.nominee.name" class="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 mb-4">
                                    <h3 class="text-xl font-bold text-white">{{ winner.nominee.name }}</h3>
                                    <p class="text-yellow-400 font-semibold mt-1">{{ winner.category.name }}</p>
                                    <p class="text-gray-400 text-sm mt-3 flex-grow line-clamp-3">{{ winner.nominee.bio }}</p>

                                    <div class="mt-4 pt-4 border-t border-yellow-400/10 w-full">
                                        <Link
                                            :href="route('awards.results.category', { year: year, category: winner.category.slug })"
                                            class="text-sm font-semibold text-yellow-500 hover:text-yellow-300 transition-colors duration-200">
                                            View Full Results
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-16">
                        <div class="bg-gray-900/50 inline-block p-8 rounded-lg shadow-xl">
                            <h3 class="text-2xl font-bold text-yellow-400">Results Are Not Yet Announced</h3>
                            <p class="mt-4 text-gray-400 max-w-lg mx-auto">
                                Please check back later to see the winners of this year's awards. Good luck to all nominees!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
