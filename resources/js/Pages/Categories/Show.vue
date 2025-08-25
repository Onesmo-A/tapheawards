<script setup>
import { Head } from '@inertiajs/vue3';
import { defineAsyncComponent } from 'vue';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import NomineeCard from '@/Components/NomineeCard.vue';
import Pagination from '@/Components/Pagination.vue';

defineOptions({
  layout: DefaultLayout,
});

const props = defineProps({
    category: Object,
    nominees: Object, // Nominee data comes with pagination
});
</script>

<template>
    <Head>
        <title>{{ category.name }}</title>
        <meta name="description" :content="category.description || `View nominees and vote in the ${category.name} category at the TAPHE Awards.`" />
    </Head>

    <main>
        <!-- Category Header -->
        <section class="pt-32 pb-16 bg-gradient-to-b from-gray-900 to-black text-white">
            <div class="text-center max-w-7xl mx-auto px-6 lg:px-8">
                <h1 class="text-base font-semibold leading-7 text-red-400 uppercase">Category</h1>
                <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl text-red-gradient drop-shadow-glow">
                    {{ category.name }}
                </p>
                <p v-if="category.description" class="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
                    {{ category.description }}
                </p>
            </div>
        </section>

        <!-- Nominees Grid for Voting -->
        <section class="bg-black py-20">
            <div class="max-w-7xl mx-auto px-6 lg:px-8">
                <div v-if="nominees.data && nominees.data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    <NomineeCard
                        v-for="nominee in nominees.data"
                        :key="nominee.id"
                        :nominee="nominee"
                    />
                </div>
                <div v-else class="text-center text-gray-400">
                    <p class="text-xl">There are currently no nominees in this category.</p>
                </div>

                <div v-if="nominees.links.length > 3" class="mt-16">
                    <Pagination :links="nominees.links" />
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.text-red-gradient {
  background: linear-gradient(to right, #ff0000, #600202, #ef2828);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.drop-shadow-glow {
  filter: drop-shadow(0 0 10px rgba(255, 34, 0, 0.6));
}
</style>
