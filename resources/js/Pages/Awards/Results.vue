<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    category: Object,
    nominees: Array,
    year: Number,
    winnerNomineeId: Number,
    title: String,
});

// Ref ya kudhibiti kuanza kwa animation
const isReady = ref(false);

onMounted(() => {
    // Tunatumia timeout fupi kuhakikisha muonekano wa awali (upana 0)
    // umewekwa kabla ya kuweka upana halisi, ili kuanzisha CSS transition.
    setTimeout(() => {
        isReady.value = true;
    }, 100);
});

// Kokotoa jumla ya kura ili kupata asilimia, na kuzuia kugawanya kwa sifuri.
const totalVotes = computed(() => {
    if (!props.nominees || props.nominees.length === 0) {
        return 1;
    }
    const sum = props.nominees.reduce((total, nominee) => total + nominee.votes_count, 0);
    return sum === 0 ? 1 : sum;
});

const totalVotesCasted = computed(() => {
    return props.nominees.reduce((total, nominee) => total + nominee.votes_count, 0);
});

// Function ya kupata asilimia kama string
const getPercentageString = (votes) => {
    if (totalVotes.value === 1 && totalVotesCasted.value === 0) {
        return '0.0';
    }
    return ((votes / totalVotes.value) * 100).toFixed(1);
};

// Function ya kupata style ya progress bar, inayowezesha animation
const getProgressStyle = (votes) => {
    const width = isReady.value ? getPercentageString(votes) : '0';
    return { width: `${width}%` };
};
</script>

<template>
    <Head :title="title" />
    <DefaultLayout>
        <div class="bg-black text-white min-h-screen">
            <header class="bg-gradient-to-b from-gray-900 via-black to-black pt-24 pb-12 sm:pt-32 sm:pb-16">
                <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <p class="text-base font-semibold leading-7 text-yellow-400 uppercase">{{ category.name }}</p>
                    <h1 class="mt-2 text-4xl font-bold tracking-tight sm:text-6xl text-gold-gradient">
                        Voting Results ({{ year }})
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        Huu ni mchanganuo wa kura kwa washiriki wote katika kategoria hii. <br>Jumla ya kura <strong class="text-yellow-400">{{ totalVotesCasted }}</strong> zilipigwa.
                    </p>
                </div>
            </header>

            <main class="pb-16 sm:pb-24">
                <div class="mx-auto max-w-4xl px-6 lg:px-8">
                    <div class="space-y-8">
                        <div v-for="nominee in nominees" :key="nominee.id"
                             class="relative rounded-lg p-6 transition-all duration-300"
                             :class="nominee.id === winnerNomineeId ? 'bg-yellow-900/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/10' : 'bg-gray-900/50 border border-gray-700'">

                            <!-- Winner Crown -->
                            <div v-if="nominee.id === winnerNomineeId" class="absolute -top-4 -left-4 text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L9.16 8.45L2 9.27L7.2 14.14L5.82 21.02L12 17.27L18.18 21.02L16.8 14.14L22 9.27L14.84 8.45L12 2Z" />
                                </svg>
                            </div>

                            <div class="flex items-center space-x-6">
                                <img :src="nominee.image_url" :alt="nominee.name" class="h-20 w-20 rounded-full object-cover flex-shrink-0 border-2" :class="nominee.id === winnerNomineeId ? 'border-yellow-400' : 'border-gray-600'">
                                <div class="flex-1">
                                    <div class="flex justify-between items-baseline">
                                        <h3 class="text-xl font-bold" :class="nominee.id === winnerNomineeId ? 'text-yellow-300' : 'text-white'">
                                            {{ nominee.name }}
                                        </h3>
                                        <span class="text-lg font-semibold" :class="nominee.id === winnerNomineeId ? 'text-yellow-300' : 'text-gray-300'">
                                            {{ nominee.votes_count }} Votes
                                        </span>
                                    </div>
                                    <div class="mt-2">
                                        <div class="w-full bg-gray-700 rounded-full h-4">
                                            <div class="h-4 rounded-full transition-all duration-1000 ease-out"
                                                 :class="nominee.id === winnerNomineeId ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-purple-600'"
                                                 :style="getProgressStyle(nominee.votes_count)">
                                            </div>
                                        </div>
                                        <p class="text-right text-sm mt-1 font-mono" :class="nominee.id === winnerNomineeId ? 'text-yellow-400' : 'text-gray-400'">
                                            {{ getPercentageString(nominee.votes_count) }}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!nominees || nominees.length === 0" class="text-center text-gray-400 py-16">
                        <p class="text-xl">No voting data available for this category.</p>
                    </div>

                    <div class="mt-16 text-center">
                        <Link :href="route('awards.index')" class="text-yellow-500 hover:text-yellow-300 font-semibold">
                            &larr; Back to Winners
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    </DefaultLayout>
</template>

<style scoped>
.text-gold-gradient {
    background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>