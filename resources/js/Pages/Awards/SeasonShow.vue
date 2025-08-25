<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head } from '@inertiajs/vue3';
import { TrophyIcon } from '@heroicons/vue/24/solid';

defineProps({
    season: Object, // Will contain season details and categories with winners
});
</script>

<template>
    <Head :title="`Winners - ${season.name}`" />

    <DefaultLayout>
        <div class="bg-black text-white min-h-screen">
            <!-- Header Section -->
            <header class="relative bg-gray-900 py-32 sm:py-40">
                <div class="absolute inset-0">
                    <img :src="season.cover_image_url" alt="Season Background" class="w-full h-full object-cover opacity-20" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                </div>
                <div class="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <p class="text-base font-semibold leading-7 text-yellow-400">Celebrating The Best Of</p>
                    <h1 class="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-yellow-300 via-gold-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                        {{ season.name }}
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
                        Honoring the outstanding achievements and contributions of the most brilliant minds in the industry for the year {{ season.year }}.
                    </p>
                </div>
            </header>

            <!-- Winners Section -->
            <main class="py-16 sm:py-24">
                <div class="mx-auto max-w-7xl px-6 lg:px-8">
                    <div v-for="category in season.categories" :key="category.id" class="mb-16 last:mb-0">
                        <div class="mb-8 border-b-2 border-yellow-400/20 pb-4">
                            <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                                {{ category.name }}
                            </h2>
                            <p class="mt-2 text-gray-400">{{ category.description }}</p>
                        </div>

                        <div v-if="category.winner" class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <!-- Winner Card -->
                            <div class="md:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gold-500/30 shadow-2xl shadow-gold-500/10">
                                <div class="flex flex-col sm:flex-row items-center gap-6">
                                    <div class="flex-shrink-0">
                                        <img :src="category.winner.image_url" :alt="category.winner.name" class="h-32 w-32 rounded-full object-cover border-4 border-gold-500">
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Winner</p>
                                        <h3 class="text-2xl font-bold text-white mt-1">{{ category.winner.name }}</h3>
                                        <p class="text-gray-300 mt-2">{{ category.winner.company }}</p>
                                    </div>
                                </div>
                                <p class="mt-6 text-gray-400 italic">
                                    "{{ category.winner.quote }}"
                                </p>
                            </div>
                            <!-- Trophy Icon -->
                            <div class="hidden md:flex justify-center items-center">
                                <TrophyIcon class="h-32 w-32 text-gold-500 opacity-50" />
                            </div>
                        </div>
                        <div v-else class="text-center py-8 bg-gray-900/50 rounded-lg border border-gray-700">
                            <p class="text-gray-400">Winner for this category is yet to be announced. Stay tuned!</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </DefaultLayout>
</template>