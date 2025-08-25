<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import Stepper from '@/Components/Stepper.vue';

defineProps({
    categories: {
        type: Array,
        required: true,
    },
    title: String,
});

const applicationSteps = [
    'Select Category',
    'Application Form',
    'Review & Status',
];
</script>

<template>
    <Head :title="title" />

    <AuthenticatedLayout>
        <template #header>
    <h2 class="font-semibold text-xl text-gray-200 leading-tight">
        {{ title }}
    </h2>
</template>


        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="mb-8">
                    <Stepper :steps="applicationSteps" :current-step="1" />
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 md:p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Choose a Category to Begin</h3>
                        <p class="text-gray-600 mb-8">
                            Select the award category you wish to apply for. Once selected, you will be taken to the application form.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div v-for="category in categories" :key="category.id" class="border border-gray-200 rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
                                <h4 class="text-lg font-bold text-gray-800 mb-2">{{ category.name }}</h4>
                                <p class="text-gray-600 text-sm flex-grow mb-6">{{ category.description }}</p>
                                <Link
                                    :href="route('user.applications.create', { category: category.id })"
                                    class="mt-auto inline-block text-center w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Apply in this Category
                                </Link>
                            </div>
                        </div>

                         <div v-if="categories.length === 0" class="text-center py-12">
                            <p class="text-gray-500 text-lg">No application categories are available at the moment. Please check back later.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>