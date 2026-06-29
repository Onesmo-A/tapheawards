<script setup>
import NomineeCard from '@/Components/NomineeCard.vue';
import { Head, Link } from '@inertiajs/vue3';
import PageHeader from '@/Components/Layout/PageHeader.vue';
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
    },
    voteSessions: {
        type: Object,
        default: () => ({}),
    }
});

const votingActive = computed(() => props.settings.voting_active);
const votingDeadline = computed(() => props.settings.voting_deadline);
const categoryVotingEnabled = computed(() => props.category.voting_enabled !== false);
const now = new Date();
const isVotingClosed = computed(() => {
    if (!votingActive.value) return true;
    if (!categoryVotingEnabled.value) return true;
    if (votingDeadline.value && new Date(votingDeadline.value) < now) {
        return true;
    }
    return false;
});

</script>

<template>
    <DefaultLayout>
        <Head>
            <title>{{ category.name + ' | TAPHE Awards' }}</title>
            <meta name="description" :content="category.description || `Vote for outstanding healthcare achievements in the ${category.name} category at TAPHE Awards.`" />
            <meta property="og:title" :content="category.name + ' | TAPHE Awards'" />
            <meta property="og:description" :content="category.description || `Vote for outstanding healthcare achievements in the ${category.name} category at TAPHE Awards.`" />
            <meta property="og:type" content="website" />
            <meta property="og:url" :content="route('categories.show', category.slug)" />
            <meta property="og:image" content="https://tapheawards.co.tz/images/share-thumbnail.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" :content="category.name + ' | TAPHE Awards'" />
            <meta name="twitter:description" :content="category.description || `Vote for outstanding healthcare achievements in the ${category.name} category at TAPHE Awards.`" />
            <meta name="twitter:image" content="https://tapheawards.co.tz/images/share-thumbnail.png" />
        </Head>

        <!-- BORESHO: Imeongezwa pt-28 (padding-top) ili kusukuma maudhui yote chini ya header kuu -->
        <div class="bg-gray-100 dark:bg-gray-900 pt-28">
            <PageHeader :title="category.name" />
            
            <div class="pb-12 lg:pb-16">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div class="text-center mt-8 mb-12 px-4">
                        <p class="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{{ category.description }}</p>
                        <div v-if="isVotingClosed" class="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-2xl mx-auto">
                            <p class="font-semibold text-red-300">
                              <span v-if="!categoryVotingEnabled">Voting for this category is disabled</span>
                              <span v-else-if="!votingActive">Voting for this category is currently closed.</span>
                              <span v-else>Voting period has ended.</span>
                            </p>
                        </div>
                    </div>
    
                    <!-- BORESHO: Imeongezwa `flex justify-center flex-wrap` ili kadi zikae katikati -->
                    <div v-if="category.nominees && category.nominees.length > 0"
                        class="flex justify-center flex-wrap gap-6 lg:gap-8 px-4 sm:px-0">
                        <NomineeCard 
                            v-for="nominee in category.nominees" 
                            :key="nominee.id" 
                            :nominee="nominee"
                            :category-url="route('categories.show', category.slug)"
                            :vote-session="voteSessions[nominee.id] || null"
                            class="nominee-card-description"
                        />
                    </div>
                    <div v-else class="text-center py-16 bg-white dark:bg-gray-800/50 rounded-lg">
                        <p class="text-gray-500 dark:text-gray-400 text-xl">No nominees found in this category.</p>
                        <Link :href="route('home')" class="mt-4 inline-block text-red-500 hover:text-red-400 transition">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<style>
/* 
  Lenga maelezo ndani ya NomineeCard ili kupunguza font-size.
  Hii inasaidia button ya 'Vote' isisukumwe chini sana.
*/
.nominee-card-description .text-sm {
    font-size: 0.8rem; /* 12.8px */
    line-height: 1.4;
}
</style>
