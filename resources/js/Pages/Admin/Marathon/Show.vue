<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    registration: {
        type: Object,
        required: true,
    },
});

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
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount) => {
    if (amount == null) return 'N/A';
    return new Intl.NumberFormat('en-US').format(amount) + ' TZS';
};

const detailSections = [
    {
        title: 'Personal Information',
        fields: [
            { label: 'Full Name', value: props.registration.full_name },
            { label: 'Phone Number', value: props.registration.phone_number },
            { label: 'Email', value: props.registration.email || 'N/A' },
            { label: 'Gender', value: props.registration.gender, format: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : 'N/A' },
            { label: 'Date of Birth', value: props.registration.date_of_birth },
        ]
    },
    {
        title: 'Race Details',
        fields: [
            { label: 'Race Type', value: props.registration.race_type },
            { label: 'T-Shirt Size', value: props.registration.tshirt_size },
            { label: 'Country', value: props.registration.country },
            { label: 'Region', value: props.registration.region },
        ]
    },
    {
        title: 'Emergency Contact',
        fields: [
            { label: 'Contact Name', value: props.registration.emergency_contact_name },
            { label: 'Contact Phone', value: props.registration.emergency_contact_phone },
            { label: 'Relationship', value: props.registration.emergency_contact_relationship || 'N/A' },
        ]
    },
    {
        title: 'Transaction Details',
        fields: [
            { label: 'Transaction ID', value: props.registration.transaction?.transaction_id || 'N/A' },
            { label: 'Order ID', value: props.registration.transaction?.order_id || 'N/A' },
            { label: 'Amount', value: props.registration.transaction?.amount, format: formatCurrency },
            { label: 'Payment Status', value: props.registration.status, isStatus: true },
        ]
    }
];
</script>

<template>
    <Head :title="`Registration - ${registration.full_name}`" />

    <div class="mb-6">
        <Link :href="route('admin.marathon.index')" class="inline-flex items-center text-sm font-medium text-gold-400 hover:text-gold-300">
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Back to Registrations
        </Link>
    </div>

    <div class="bg-gray-800/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row justify-between items-start">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-white">
                        {{ registration.full_name }}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-400">
                        Unique Code: <span class="font-semibold text-gold-400">{{ registration.unique_code }}</span>
                    </p>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-4">
                    <span
                        :class="getStatusClass(registration.status)"
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                        {{ formatStatus(registration.status) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-700">
            <dl class="divide-y divide-gray-700">
                <template v-for="section in detailSections" :key="section.title">
                    <div v-for="(field, index) in section.fields" :key="field.label" class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" :class="{ 'bg-gray-800/20': index % 2 !== 0 }">
                        <dt class="text-sm font-medium text-gray-400">{{ field.label }}</dt>
                        <dd class="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <template v-if="field.isStatus">
                                <span :class="getStatusClass(field.value)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(field.value) }}
                                </span>
                            </template>
                            <template v-else>
                                {{ field.format ? field.format(field.value) : field.value }}
                            </template>
                        </dd>
                    </div>
                </template>
            </dl>
        </div>
    </div>
</template>