<template>
    <AdminLayout :title="`Transaction: ${transaction.order_id}`">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto">
                <!-- Header -->
                <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <p class="text-sm font-medium text-gray-500">Transaction Details</p>
                                <h2 class="mt-1 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight font-mono">{{ transaction.order_id }}</h2>
                            </div>
                            <div class="sm:ml-4 mt-0 flex-shrink-0">
                                <span :class="statusClass(transaction.status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                    {{ formatStatus(transaction.status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Details -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Transaction Details -->
                    <div class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Payment Information</h3>
                            <div class="mt-5 border-t border-gray-200">
                                <dl class="divide-y divide-gray-200">
                                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Amount</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ transaction.amount }} {{ transaction.currency }}</dd>
                                    </div>
                                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ transaction.phone_number }}</dd>
                                    </div>
                                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Gateway Ref</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono">{{ transaction.gateway_reference || 'N/A' }}</dd>
                                    </div>
                                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Date</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ new Date(transaction.created_at).toLocaleString() }}</dd>
                                    </div>
                                     <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Notes</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 break-words">{{ transaction.notes || 'N/A' }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <!-- Related Info -->
                    <div class="bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Related Information</h3>
                            <div class="mt-5 border-t border-gray-200">
                                <dl class="divide-y divide-gray-200">
                                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">User</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ transaction.user?.name || 'Guest User' }}</dd>
                                    </div>
                                    <div v-if="transaction.payable" class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">For Application</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            <Link :href="route('admin.applications.show', transaction.payable.id)" class="text-indigo-600 hover:underline">
                                                {{ transaction.payable.applicant_name }}
                                            </Link>
                                        </dd>
                                    </div>
                                    <div v-if="transaction.payable && transaction.payable.category" class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-500">Category</dt>
                                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ transaction.payable.category.name }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    transaction: Object,
});

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