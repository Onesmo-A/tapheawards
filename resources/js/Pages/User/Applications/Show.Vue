<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { ArrowLeftIcon, PrinterIcon } from '@heroicons/vue/24/solid';

defineOptions({ layout: AuthenticatedLayout });

const props = defineProps({
    application: Object,
});

const statusDetails = (status) => {
    const details = {
        pending_payment: { text: 'Inasubiri Malipo', class: 'text-yellow-600' },
        payment_failed: { text: 'Malipo Yameshindikana', class: 'text-red-600' },
        pending_review: { text: 'Inasubiri Uhakiki', class: 'text-blue-600' },
        approved: { text: 'Limekubaliwa', class: 'text-green-600' },
        rejected: { text: 'Limekataliwa', class: 'text-gray-600' },
    };
    return details[status] || { text: status.replace(/_/g, ' '), class: 'text-gray-600' };
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('sw-TZ', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const printPage = () => {
    window.print();
};
</script>

<template>
    <Head>
        <title>Taarifa za Ombi #{{ application.id }}</title>
    </Head>

    <div class="py-8 md:py-12 bg-gray-50 min-h-full">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="flex justify-between items-center mb-6">
                <Link :href="route('user.applications.index')" class="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ArrowLeftIcon class="h-5 w-5 mr-2" />
                    Rudi Kwenye Maombi
                </Link>
                <button @click="printPage" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 print:hidden">
                    <PrinterIcon class="h-5 w-5 mr-2" />
                    Chapisha
                </button>
            </div>

            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="px-6 py-8 md:px-10">
                    <!-- Header -->
                    <div class="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-6 mb-6">
                        <div>
                            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Risiti ya Ombi</h1>
                            <p class="text-gray-500 text-sm mt-1">Namba ya Ombi: #{{ application.id }}</p>
                        </div>
                        <div class="text-left md:text-right mt-4 md:mt-0">
                            <p class="text-lg font-semibold" :class="statusDetails(application.status).class">
                                {{ statusDetails(application.status).text }}
                            </p>
                            <p class="text-sm text-gray-500">Tarehe: {{ formatDate(application.created_at) }}</p>
                        </div>
                    </div>

                    <!-- Application Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">TAARIFA ZA MWOMBAJI</h3>
                            <div class="mt-2 text-gray-800">
                                <p class="font-medium">{{ application.applicant_name }}</p>
                                <p>{{ $page.props.auth.user.email }}</p>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">KATEGORIA YA TUZO</h3>
                            <div class="mt-2 text-gray-800">
                                <p class="font-medium">{{ application.category?.name || 'Haijulikani' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Transaction Details -->
                    <div class="mt-10" v-if="application.transaction">
                        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">TAARIFA ZA MALIPO</h3>
                        <div class="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div class="sm:col-span-1">
                                    <dt class="text-gray-500">Namba ya Muamala:</dt>
                                    <dd class="mt-1 font-mono text-gray-900">{{ application.transaction.order_id }}</dd>
                                </div>
                                <div class="sm:col-span-1">
                                    <dt class="text-gray-500">Rejea ya Mtoa Huduma:</dt>
                                    <dd class="mt-1 font-mono text-gray-900">{{ application.transaction.gateway_reference || '---' }}</dd>
                                </div>
                                <div class="sm:col-span-1">
                                    <dt class="text-gray-500">Njia ya Malipo:</dt>
                                    <dd class="mt-1 font-medium text-gray-900">{{ application.transaction.payment_method || '---' }}</dd>
                                </div>
                                <div class="sm:col-span-1">
                                    <dt class="text-gray-500">Tarehe ya Malipo:</dt>
                                    <dd class="mt-1 font-medium text-gray-900">{{ formatDate(application.transaction.updated_at) }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Totals -->
                    <div class="mt-10 border-t border-gray-200 pt-6">
                        <div class="flex justify-end">
                            <div class="w-full max-w-xs">
                                <dl class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <dt class="text-gray-600">Ada ya Fomu:</dt>
                                        <dd class="text-gray-800">TZS {{ new Intl.NumberFormat().format(application.transaction?.amount || 0) }}</dd>
                                    </div>
                                    <div class="flex justify-between border-t border-gray-200 pt-2 font-bold text-base">
                                        <dt class="text-gray-900">Jumla Iliyolipwa:</dt>
                                        <dd class="text-gray-900">TZS {{ new Intl.NumberFormat().format(application.transaction?.amount || 0) }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media print {
    .print\:hidden { display: none; }
    body { -webkit-print-color-adjust: exact; }
}
</style>