<template>
    <AdminLayout title="Nominee Suggestions">
        <FlashMessage />
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Nominee Suggestions</h1>
                    <p class="mt-2 text-sm text-gray-700">A list of all nominee suggestions submitted by users.</p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <a :href="route('admin.suggestions.export.pdf', { search: search })" target="_blank" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Export PDF
                    </a>
                </div>
            </div>

            <!-- Filters -->
            <div class="mt-4">
                <TextInput type="text" v-model="search" placeholder="Search by nominee, suggester, reason..." class="w-full md:w-1/3" />
            </div>

            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Suggested Nominee</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reason</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Suggested By</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span class="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="suggestion in suggestions.data" :key="suggestion.id">
                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            <p>{{ suggestion.suggested_nominee_name }}</p>
                                            <p class="text-gray-500">{{ suggestion.suggested_nominee_phone }}</p>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ suggestion.category.name }}</td>
                                        <td class="px-3 py-4 text-sm text-gray-500">
                                            <p class="truncate max-w-xs" :title="suggestion.reason">{{ suggestion.reason }}</p>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <p>{{ suggestion.suggester_name || 'Anonymous' }}</p>
                                            <p class="text-gray-500">{{ suggestion.suggester_email }}</p>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new Date(suggestion.created_at).toLocaleString('sw-TZ') }}</td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button @click="confirmDeletion(suggestion)" class="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    <tr v-if="suggestions.data.length === 0">
                                        <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No suggestions found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <Pagination :links="suggestions.links" class="mt-6" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Deletion Confirmation Modal -->
        <ConfirmationModal :show="confirmingDeletion" @close="confirmingDeletion = false">
            <template #title>
                Delete Suggestion
            </template>
            <template #content>
                Are you sure you want to delete the suggestion for "{{ suggestionToDelete?.suggested_nominee_name }}"? This action cannot be undone.
            </template>
            <template #footer>
                <SecondaryButton @click="confirmingDeletion = false">Cancel</SecondaryButton>
                <DangerButton class="ml-3" @click="deleteSuggestion" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Delete
                </DangerButton>
            </template>
        </ConfirmationModal>
    </AdminLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import debounce from 'lodash/debounce';

const props = defineProps({
    suggestions: Object,
    filters: Object,
});

const search = ref(props.filters.search || '');
const confirmingDeletion = ref(false);
const suggestionToDelete = ref(null);
const form = useForm({});

watch(search, debounce((value) => {
    router.get(route('admin.suggestions.index'), { search: value }, {
        preserveState: true,
        replace: true,
    });
}, 300));

const confirmDeletion = (suggestion) => {
    suggestionToDelete.value = suggestion;
    confirmingDeletion.value = true;
};

const deleteSuggestion = () => {
    form.delete(route('admin.suggestions.destroy', suggestionToDelete.value.id), {
        preserveScroll: true,
        onSuccess: () => {
            confirmingDeletion.value = false;
            suggestionToDelete.value = null;
        },
    });
};
</script>
