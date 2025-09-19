<script setup>
import { ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import StatCard from '@/Components/StatCard.vue';
import { TicketIcon, CheckCircleIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    registrations: Object,
    filters: Object,
    stats: Object,
});

const search = ref(props.filters.search);
const status = ref(props.filters.status);

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'payment_failed', label: 'Payment Failed' },
];

const getStatusClass = (status) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'pending_payment':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'payment_failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

watch([search, status], debounce(function ([searchValue, statusValue]) {
    router.get(route('admin.marathon.index'), {
        search: searchValue,
        status: statusValue,
    }, {
        preserveState: true,
        replace: true,
    });
}, 300));

</script>

<template>
    <Head title="Marathon Registrations" />
    
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h2 class="text-2xl font-bold text-white">Marathon Registrations</h2>
            <p class="mt-1 text-sm text-gray-400">Manage and view all participants for the marathon event.</p>
        </div>
        <!-- BORESHO: Ongeza vitufe vya Export -->
        <div class="mt-4 sm:mt-0 flex space-x-2">
            <a :href="route('admin.marathon.export.pdf', { search: filters.search, status: filters.status })"
               class="inline-flex items-center px-4 py-2 bg-red-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-600 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                <!-- SVG for PDF -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm3 4a1 1 0 10-2 0v2a1 1 0 102 0V8zm4 0a1 1 0 10-2 0v2a1 1 0 102 0V8zm-4 4a1 1 0 10-2 0v2a1 1 0 102 0v-2zm4 0a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clip-rule="evenodd" /></svg>
                Export PDF
            </a>
            <a :href="route('admin.marathon.export.excel', { search: filters.search, status: filters.status })"
               class="inline-flex items-center px-4 py-2 bg-green-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-600 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                <!-- SVG for Excel -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 1v2h12V6H4zm0 4v6h12v-6H4zm2-2h2v2H6V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8z" clip-rule="evenodd" /></svg>
                Export Excel
            </a>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Registrations" :value="stats.total" color="blue">
            <TicketIcon class="h-6 w-6" />
        </StatCard>
        <StatCard title="Completed Payments" :value="stats.completed" color="green">
            <CheckCircleIcon class="h-6 w-6" />
        </StatCard>
        <StatCard title="Pending Payments" :value="stats.pending" color="yellow">
            <ClockIcon class="h-6 w-6" />
        </StatCard>
    </div>

    <!-- Filters and Table -->
    <div class="bg-gray-800/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl">
        <!-- Filter Bar -->
        <div class="p-4 sm:p-6 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-grow">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search by name, email, phone, or code..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-gold-500 focus:border-gold-500"
                    />
                </div>
                <div class="flex-shrink-0">
                    <select
                        v-model="status"
                        class="w-full sm:w-auto border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-gold-500 focus:border-gold-500"
                    >
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unique Code</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Race Type</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registered On</th>
                        <th scope="col" class="relative px-6 py-3">
                            <span class="sr-only">View</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-gray-800/50 divide-y divide-gray-700">
                    <tr v-if="registrations.data.length === 0">
                        <td colspan="7" class="px-6 py-12 text-center text-sm text-gray-400">
                            No registrations found matching your criteria.
                        </td>
                    </tr>
                    <tr v-for="registration in registrations.data" :key="registration.id" class="hover:bg-gray-700/50 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gold-400">
                            {{ registration.unique_code }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {{ registration.full_name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div class="flex flex-col">
                                <span>{{ registration.phone_number }}</span>
                                <span v-if="registration.email" class="text-xs text-gray-400">{{ registration.email }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {{ registration.race_type }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                                :class="getStatusClass(registration.status)"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            >
                                {{ formatStatus(registration.status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {{ formatDate(registration.created_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                                :href="route('admin.marathon.show', registration.id)"
                                class="text-gold-400 hover:text-gold-300"
                            >
                                View
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="registrations.links.length > 3" class="p-4 sm:p-6 border-t border-gray-700">
            <Pagination :links="registrations.links" />
        </div>
    </div>
</template>

<style scoped>
/* Custom styles for form inputs to match the dark theme */
.form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    appearance: none;
}
</style>