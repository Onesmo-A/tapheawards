<template>
    <AdminLayout title="Transactions">
        <FlashMessage />
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Transactions</h1>
                    <p class="mt-2 text-sm text-gray-700">A list of all financial transactions recorded in the system.</p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <a :href="route('admin.transactions.export.pdf', { search: filters.search, status: filters.status })" target="_blank" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Export PDF
                    </a>
                </div>
            </div>

            <!-- Filters -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <TextInput type="text" v-model="filters.search" placeholder="Search by Order ID, Phone, Name..." class="w-full" />
                <SelectInput v-model="filters.status" class="w-full">
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                </SelectInput>
            </div>

            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone Number</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span class="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="transaction in transactions.data" :key="transaction.id">
                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6">{{ transaction.order_id.substring(0, 8) }}...</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                            <p>{{ transaction.user?.name || 'Guest User' }}</p>
                                            <!-- BORESHO: Kagua kama 'payable' ipo na onyesha jina sahihi kulingana na aina ya muamala -->
                                            <p v-if="transaction.payable" class="text-xs text-gray-500">
                                                For: {{ transaction.payable.applicant_name || transaction.payable.full_name || 'N/A' }}
                                            </p>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ transaction.amount }} {{ transaction.currency }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                                            <span :class="statusClass(transaction.status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                                {{ formatStatus(transaction.status) }}
                                            </span>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ transaction.phone_number }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new Date(transaction.created_at).toLocaleString() }}</td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link :href="route('admin.transactions.show', transaction.id)" class="text-indigo-600 hover:text-indigo-900">View<span class="sr-only">, {{ transaction.order_id }}</span></Link>
                                        </td>
                                    </tr>
                                    <tr v-if="transactions.data.length === 0">
                                        <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <Pagination :links="transactions.links" class="mt-6" />
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue';
import SelectInput from '@/Components/SelectInput.vue';
import debounce from 'lodash/debounce';

const props = defineProps({
    transactions: Object,
    filters: Object,
});

const filters = ref({
    search: props.filters.search || '',
    status: props.filters.status || '',
});

watch(filters, debounce(() => {
    router.get(route('admin.transactions.index'), filters.value, {
        preserveState: true,
        replace: true,
    });
}, 300), { deep: true });

const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const statusClass = (status) => {
    const classes = {
        'completed': 'bg-green-50 text-green-700 ring-green-600/20',
        'pending': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        'failed': 'bg-red-50 text-red-700 ring-red-600/10',
        'cancelled': 'bg-gray-50 text-gray-600 ring-gray-500/10',
    };
    return classes[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};
</script>