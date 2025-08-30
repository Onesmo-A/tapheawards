<script setup>
import NomineeCard from '@/Components/NomineeCard.vue';
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';

// Props
const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
    settings: {
        type: Object,
        required: true,
    }
});

const categoryUrl = computed(() => route('categories.show', props.category.slug));

const votingActive = computed(() => props.settings.voting_active);
const votingDeadline = computed(() => props.settings.voting_deadline);
const now = new Date();
const isVotingClosed = computed(() => {
    if (!votingActive.value) return true;
    if (votingDeadline.value && new Date(votingDeadline.value) < now) {
        return true;
    }
    return false;
});

</script>

<template>
    <DefaultLayout :title="category.name">
        <Head :title="category.name" />

        <div class="py-12 bg-gray-900 text-white">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">{{ category.name }}</h1>
                    <p class="text-lg text-gray-400 max-w-3xl mx-auto">{{ category.description }}</p>
                    <div v-if="isVotingClosed" class="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-2xl mx-auto">
                        <p class="font-semibold text-red-300">Voting for this category is currently closed.</p>
                    </div>
                </div>

                <div v-if="category.nominees && category.nominees.length > 0"
                    class="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-8 justify-items-center">
                    <NomineeCard 
                        v-for="nominee in category.nominees" 
                        :key="nominee.id" 
                        :nominee="nominee"
                        :categoryUrl="categoryUrl"
                    />
                </div>
                <div v-else class="text-center py-16">
                    <p class="text-gray-500 text-xl">No nominees found in this category.</p>
                    <Link :href="route('home')" class="mt-4 inline-block text-red-500 hover:text-red-400 transition">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
