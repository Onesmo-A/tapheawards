<script setup>
import { Head, Link } from '@inertiajs/vue3';
import Stepper from '@/Components/Stepper.vue';
import AuthenticatedLayout from '@/Layouts/AAAAAuthenticatedLayout.vue';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';

defineProps({
    categoryGroups: Array,
});

const steps = [
    { name: 'Chagua Tuzo', status: 'current' },
    { name: 'Jaza Fomu', status: 'upcoming' },
    { name: 'Malipo & Uthibitisho', status: 'upcoming' },
];
</script>

<template>
    <Head title="Anzisha Maombi - Chagua Tuzo" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">Anzisha Maombi ya Tuzo</h2>
        </template>

        <div class="py-12">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <Stepper :steps="steps" class="mb-8" />

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">1. Chagua Tuzo</h3>
                        <p class="mt-1 text-sm text-gray-600">Chagua kundi la tuzo, kisha uchague tuzo mahususi unayotaka kuombea.</p>

                        <div v-if="categoryGroups.length > 0" class="mt-6 space-y-6">
                            <div v-for="group in categoryGroups" :key="group.id" class="bg-gray-50 p-4 rounded-md">
                                <h4 class="text-md font-semibold text-gray-800">{{ group.name }}</h4>
                                <ul role="list" class="mt-3 divide-y divide-gray-200 border-t border-b border-gray-200" v-if="group.children && group.children.length > 0">
                                    <li v-for="award in group.children" :key="award.id">
                                        <Link :href="route('user.applications.create', award.id)" class="flex items-center justify-between py-3 px-2 hover:bg-gray-100">
                                            <span class="text-sm text-indigo-700 font-medium">{{ award.name }}</span>
                                            <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                                        </Link>
                                    </li>
                                </ul>
                                <p v-else class="mt-2 text-sm text-gray-500">Hakuna tuzo zinazopatikana kwenye kundi hili kwa sasa.</p>
                            </div>
                        </div>
                        <div v-else class="mt-6 text-center py-10 bg-gray-50 rounded-lg">
                            <h4 class="text-lg font-semibold text-gray-700">Hakuna Tuzo Zinazopokea Maombi</h4>
                            <p class="mt-2 text-sm text-gray-500">Tafadhali rudi tena baadaye kuangalia kama tuzo zimeshafunguliwa kwa ajili ya maombi.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>