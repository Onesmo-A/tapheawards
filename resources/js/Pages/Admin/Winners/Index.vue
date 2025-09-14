<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import DangerButton from '@/Components/DangerButton.vue';

const props = defineProps({
    categories: Array,
    currentYear: Number,
    filters: Object,
});

const toast = useToast();
const selectedYear = ref(props.currentYear);

// Watch for year changes and refetch data
watch(selectedYear, (newYear) => {
    router.get(route('admin.winners.index'), { year: newYear }, {
        preserveState: true,
        replace: true,
    });
});

const forms = ref({});

props.categories.forEach(category => {
    forms.value[category.id] = useForm({
        category_id: category.id,
        nominee_id: category.winner_nominee_id || (category.nominees.length > 0 ? category.nominees[0].id : null),
        year: props.currentYear,
    });
});

const declareWinner = (categoryId) => {
    const form = forms.value[categoryId];
    form.post(route('admin.winners.store'), {
        preserveScroll: true,
        onSuccess: () => {
            toast.success('Winner declared successfully!');
            // Manually update the winner_nominee_id on the category to reflect the change instantly
            const category = props.categories.find(c => c.id === categoryId);
            if (category) {
                category.winner_nominee_id = form.nominee_id;
            }
        },
        onError: (errors) => {
            toast.error('Failed to declare winner. Please check the form.');
            console.error(errors);
        },
    });
};

const removeWinner = (categoryId) => {
    const category = props.categories.find(c => c.id === categoryId);
    const winner = category?.winners[0];

    if (!winner) {
        toast.error("No winner found to remove.");
        return;
    }

    if (confirm('Are you sure you want to remove this winner? This action cannot be undone.')) {
        router.delete(route('admin.winners.destroy', winner.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Winner removed successfully!');
                // BORESHO: Sasisha state ya category husika mara moja
                if (category) {
                    category.winner_nominee_id = null;
                }
            },
            onError: () => toast.error('Failed to remove winner.'),
        });
    }
};

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 2 - i);

</script>

<template>
    <Head title="Declare Winners" />

    <AdminLayout>
        <div class="container px-6 mx-auto grid">
            <div class="flex justify-between items-center my-6">
                <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Declare Winners for {{ currentYear }}
                </h2>
                <!-- Year Filter -->
                <div class="w-1/4">
                    <label for="year-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Year</label>
                    <select id="year-filter" v-model="selectedYear"
                        class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                        <option v-for="year in years" :key="year" :value="year">
                            {{ year }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-2">
                <!-- Category Cards -->
                <div v-for="category in categories" :key="category.id"
                    class="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <h3 class="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                        {{ category.name }}
                    </h3>
                    <p v-if="category.nominees.length === 0" class="text-gray-500 dark:text-gray-400">No nominees in this category.</p>
                    <form v-else @submit.prevent="declareWinner(category.id)">
                        <div class="space-y-4">
                            <div v-for="nominee in category.nominees" :key="nominee.id"
                                class="flex items-center justify-between p-3 rounded-lg transition-colors duration-200"
                                :class="{
                                    'bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-400': category.winner_nominee_id === nominee.id,
                                    'bg-gray-50 dark:bg-gray-900/50': category.winner_nominee_id !== nominee.id
                                }">
                                <div class="flex items-center">
                                    <input type="radio" :id="`nominee-${nominee.id}`" :name="`winner-${category.id}`"
                                        :value="nominee.id" v-model="forms[category.id].nominee_id"
                                        class="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500">
                                    <label :for="`nominee-${nominee.id}`" class="ml-3 flex items-center">
                                        <img class="object-cover w-10 h-10 rounded-full mr-3" :src="nominee.image_url" :alt="nominee.name">
                                        <div>
                                            <span class="font-medium text-gray-800 dark:text-gray-200">{{ nominee.name }}</span>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                                Votes: <span class="font-bold">{{ nominee.votes_count }}</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <span v-if="category.winner_nominee_id === nominee.id"
                                    class="px-2 py-1 text-xs font-bold leading-tight text-yellow-700 bg-yellow-200 rounded-full dark:bg-yellow-700 dark:text-yellow-100">
                                    WINNER
                                </span>
                            </div>
                        </div>
                        <div class="mt-6 flex items-center space-x-4">
                            <button type="submit" :disabled="forms[category.id].processing"
                                class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple disabled:opacity-50">
                                {{ forms[category.id].processing ? 'Saving...' : (category.winner_nominee_id ? 'Update Winner' : 'Declare Winner') }}
                            </button>

                            <DangerButton
                                v-if="category.winner_nominee_id"
                                @click="removeWinner(category.id)"
                                type="button"
                                class="disabled:opacity-50"
                                :disabled="forms[category.id].processing"
                            >
                                Remove Winner
                            </DangerButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
