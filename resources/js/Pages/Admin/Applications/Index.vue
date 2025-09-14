<template>
    <AdminLayout title="Nominee Applications">
        <FlashMessage />
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Nominee Applications</h1>
                    <p class="mt-2 text-sm text-gray-700">A list of all the nominee applications in the system.</p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <a :href="route('admin.applications.export.pdf', { search: filters.search, status: filters.status })" target="_blank" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Export PDF
                    </a>
                </div>
            </div>

            <!-- Filters -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <TextInput type="text" v-model="filters.search" placeholder="Search by name, email..." class="w-full" />
                <SelectInput v-model="filters.status" class="w-full">
                    <option value="">All Statuses</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_failed">Payment Failed</option>
                </SelectInput>
            </div>

            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Applicant Name</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Photo</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted On</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span class="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="application in applications.data" :key="application.id">
                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ application.applicant_name }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ application.category.name }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <img 
                                              v-if="application.photo_path" 
                                              :src="`/storage/${application.photo_path}`" 
                                              alt="Applicant Photo" 
                                              class="h-10 w-10 rounded-full object-cover"/>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span :class="statusClass(application.status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                                {{ formatStatus(application.status) }}
                                            </span>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span v-if="application.transaction" :class="statusClass(application.transaction.status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                                {{ formatStatus(application.transaction.status) }}
                                            </span>
                                            <span v-else class="text-gray-400">N/A</span>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new Date(application.created_at).toLocaleString('sw-TZ') }}</td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link :href="route('admin.applications.show', application.id)" class="text-indigo-600 hover:text-indigo-900">View<span class="sr-only">, {{ application.applicant_name }}</span></Link>
                                        </td>
                                    </tr>
                                    <tr v-if="applications.data.length === 0">
                                        <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No applications found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <Pagination :links="applications.links" class="mt-6" />
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import { Link } from '@inertiajs/vue3';
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import SelectInput from '@/Components/SelectInput.vue';
import debounce from 'lodash/debounce';

const props = defineProps({
    applications: Object,
    filters: Object,
});

const filters = ref({
    search: props.filters.search || '',
    status: props.filters.status || '',
});

watch(filters, debounce(() => {
    router.get(route('admin.applications.index'), filters.value, {
        preserveState: true,
        replace: true,
    });
}, 300), { deep: true });

const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const statusClass = (status) => {
    const classes = {
        'pending_review': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        'pending_payment': 'bg-blue-50 text-blue-800 ring-blue-600/20',
        'approved': 'bg-green-50 text-green-700 ring-green-600/20',
        'completed': 'bg-green-50 text-green-700 ring-green-600/20',
        'rejected': 'bg-red-50 text-red-700 ring-red-600/10',
        'payment_failed': 'bg-red-50 text-red-700 ring-red-600/10',
        'failed': 'bg-red-50 text-red-700 ring-red-600/10',
        'pending': 'bg-blue-50 text-blue-800 ring-blue-600/20',
    };
    return classes[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};
</script>
