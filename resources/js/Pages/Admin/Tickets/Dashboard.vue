<script setup>
import { ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import Pagination from '@/Components/Pagination.vue';
import TextInput from '@/Components/TextInput.vue'; // Assuming this component exists
import StatCard from '@/Components/StatCard.vue';
import { formatCurrency, formatDate } from '@/Utils/utils.js';


import {
    TicketIcon,
    UserCircleIcon,
    CalendarDaysIcon,
    QrCodeIcon,
    CurrencyDollarIcon,
    HashtagIcon,
    CheckCircleIcon,
    PaperAirplaneIcon,
    CreditCardIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    title: String,
    purchases: Object,
    filters: Object,
    stats: {
        type: Object,
        default: () => ({ totalSold: 0, checkedIn: 0, revenue: 0 })
    }
});

const statusClasses = {
    completed: 'bg-green-400/20 text-green-300',
    pending: 'bg-yellow-400/20 text-yellow-300',
    failed: 'bg-red-400/20 text-red-300',
    pending_payment: 'bg-blue-400/20 text-blue-300',
};

const search = ref(props.filters.search);
const status = ref(props.filters.status || 'completed'); // Default to 'completed'

const filterTabs = [
    { name: 'Completed', value: 'completed', description: 'Purchases with successful payments.' },
    { name: 'Pending Payment', value: 'pending_payment', description: 'Purchases initiated but not yet paid.' },
    { name: 'Checked In', value: 'checked_in', description: 'Purchases with at least one ticket checked in.' },
    { name: 'Failed', value: 'failed', description: 'Purchases with failed payments.' },
    { name: 'All', value: '', description: 'Show all purchases regardless of status.' },
];

watch(search, (value) => {
    router.get(route('admin.tickets.dashboard'), { search: value, status: status.value }, {
        preserveState: true,
        replace: true,
    });
});

function filterByStatus(newStatus) {
    status.value = newStatus;
    router.get(route('admin.tickets.dashboard'), { status: newStatus, search: search.value }, {
        preserveState: true,
        replace: true,
    });
}

</script>

<template>
    <Head :title="title" />

    <AdminLayout>
        <template #header>
            <PageHeader class="flex justify-between items-center">
                <!-- <div>
                    <template #title>{{ title }}</template>
                    <template #description>Track and manage all ticket sales and entries.</template>
                </div> -->
                <Link :href="route('admin.tickets.create')" class="btn-primary">
                    Create Tickets
                </Link>
            </PageHeader>
        </template>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link :href="route('admin.tickets.dashboard', { status: 'completed' })">
                <StatCard title="Tickets Sold" :value="stats.totalSold" color="blue">
                    <TicketIcon class="h-6 w-6" />
                </StatCard>
            </Link>
            <Link :href="route('admin.tickets.dashboard', { status: 'checked_in' })" title="View all purchases with checked-in tickets">
                <StatCard title="Checked In" :value="stats.checkedIn" color="green">
                    <CheckCircleIcon class="h-6 w-6" />
                </StatCard>
            </Link>
            <Link :href="route('admin.transactions.index', { status: 'completed' })">
                <StatCard title="Revenue (TZS)" :value="formatCurrency(stats.revenue)" color="teal">
                    <CurrencyDollarIcon class="h-6 w-6" />
                </StatCard>
            </Link>
        </div>

        <!-- Search and Filters -->
        <div class="mb-6 flex justify-between items-center">
            <!-- Filter Tabs -->
            <div class="flex items-center space-x-2 border-b border-gray-700">
                <button v-for="tab in filterTabs" :key="tab.value" @click="filterByStatus(tab.value)" :class="[
                        'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none',
                        status === tab.value
                            ? 'border-b-2 border-indigo-400 text-indigo-300'
                            : 'text-gray-400 hover:text-gray-200'
                    ]">
                    {{ tab.name }}
                </button>
            </div>

            <div class="w-1/3">
                <TextInput type="text" v-model="search" placeholder="Search by name, email, or ticket code..."
                    class="w-full" />
            </div>
        </div>

        <!-- Purchases Table -->
        <div class="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-2xl">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">Buyer</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Ticket Type</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Qty</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Ticket Numbers</th>
                    <th scope="col" class="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Order ID</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Total (TZS)</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Payment Status</th>
                    <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    <tr v-if="purchases.data.length === 0">
                        <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                            <div class="flex flex-col items-center">
                                <TicketIcon class="h-12 w-12 text-gray-600" />
                                <h3 class="mt-2 text-lg font-medium">No Purchases Found</h3>
                                <p class="mt-1 text-sm text-gray-500" v-if="status">
                                    No purchases match the filter '{{ status.replace('_', ' ') }}'.
                                </p>
                                <p class="mt-1 text-sm text-gray-500" v-else>
                                    There are no ticket purchases in the system yet.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="purchase in purchases.data" :key="purchase.id" class="hover:bg-gray-700/50 transition-colors duration-200">
                        <td class="py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div class="flex items-center">
                                <div class="h-10 w-10 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
                                    <UserCircleIcon class="h-6 w-6 text-gray-400" />
                                </div>
                                <div class="ml-4">
                                    <div class="font-medium text-white">{{ purchase.purchaser_name }}</div>
                                    <div class="text-gray-400">{{ purchase.purchaser_email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            <div class="flex items-center">
                                <TicketIcon class="h-5 w-5 mr-2 text-gold-400" />
                                {{ purchase.ticket_type.name }}
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            <div class="flex items-center">
                                <HashtagIcon class="h-5 w-5 mr-1 text-gray-500" />
                                {{ purchase.quantity }}
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                            <div v-if="purchase.tickets && purchase.tickets.length > 0" class="flex flex-col space-y-1">
                                <div v-for="ticket in purchase.tickets" :key="ticket.id" class="flex items-center font-mono text-xs">
                                    <QrCodeIcon class="h-4 w-4 mr-1.5 text-gray-500" />
                                    <span>{{ ticket.ticket_code }}</span>
                                </div>
                            </div>
                            <div v-else class="text-gray-500 text-xs">
                                Generating...
                            </div>
                        </td>
                        <td class="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                            <div class="flex items-center font-mono text-xs">
                                <HashtagIcon class="h-4 w-4 mr-1 text-gray-500" />
                                {{ purchase.main_transaction?.order_id.substring(0, 8) }}...
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            <div class="flex items-center font-semibold">
                                <CurrencyDollarIcon class="h-5 w-5 mr-1 text-green-400" />
                                {{ formatCurrency(purchase.total_amount) }}
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                            <span v-if="purchase.main_transaction"
                                :class="[
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                    statusClasses[purchase.main_transaction.status] || 'bg-gray-500/20 text-gray-300'
                                ]">
                                <CreditCardIcon class="h-4 w-4 mr-1.5" />
                                {{ purchase.main_transaction.status }}
                            </span>
                            <span v-else class="text-gray-500 text-xs">N/A (Manual)</span>
                        </td>
                        <td class="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                            <div class="flex items-center">
                                <CalendarDaysIcon class="h-5 w-5 mr-2 text-gray-500" />
                                {{ formatDate(purchase.created_at) }}
                            </div>
                        </td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 ">
                            <div v-if="purchase.status === 'completed'" class="flex items-center justify-end space-x-4">
                                <a :href="route('tickets.download', { order_id: purchase.main_transaction?.order_id })"
                                   v-if="purchase.main_transaction"
                                   class="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center"
                                   title="Download PDF">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1">
                                        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                                        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                                    </svg>
                                </a>
                                <Link
                                    :href="route('admin.tickets.resend', purchase.id)"
                                    method="post"
                                    as="button"
                                    class="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center"
                                    title="Resend Tickets"
                                >
                                    <PaperAirplaneIcon class="h-5 w-5 mr-1" />
                                </Link>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="purchases.data.length > 0" class="mt-6">
            <Pagination :links="purchases.links" />
        </div>

    </AdminLayout>
</template>
<style>
/*
  BORESHO: Mtindo maalum wa scrollbar kwa mandhari ya giza.
  Hii inalenga vivinjari vinavyotumia WebKit (Chrome, Edge, Safari) na itarekebisha
  muonekano wa horizontal scrollbar kwenye jedwali.
*/
::-webkit-scrollbar {
  width: 12px; /* Upana wa vertical scrollbar */
  height: 12px; /* Urefu wa horizontal scrollbar */
}
::-webkit-scrollbar-track {
  background: #1f2937; /* Rangi ya usuli wa eneo la scrollbar (gray-800) */
}
::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Rangi ya scrollbar yenyewe (gray-600) */
  border-radius: 6px;
  border: 3px solid #1f2937; /* Nafasi kuzunguka scrollbar (gray-800) */
}
</style>