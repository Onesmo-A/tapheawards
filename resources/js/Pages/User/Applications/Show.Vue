<script setup>
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AAAAAuthenticatedLayout.vue';
import { ArrowLeftIcon, PrinterIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';

defineOptions({ layout: AuthenticatedLayout });

const props = defineProps({
    application: Object,
});

const statusDetails = (status) => {
    const details = {
        pending_payment: { text: 'Malipo Yanasubiriwa', class: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
        payment_failed: { text: 'Malipo Yameshindikana', class: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
        pending_review: { text: 'Malipo Yanahakikiwa', class: 'bg-blue-100 text-blue-800', icon: ClockIcon },
        approved: { text: 'Ombi Limekubaliwa', class: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
        rejected: { text: 'Ombi Limekataliwa', class: 'bg-gray-200 text-gray-800', icon: ExclamationTriangleIcon },
    };
    return details[status] || { text: status.replace(/_/g, ' '), class: 'bg-gray-100 text-gray-800', icon: ClockIcon };
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

const canRetryPayment = computed(() => {
    return ['pending_payment', 'payment_failed'].includes(props.application.status);
});

const retryForm = useForm({});

const retryPayment = () => {
    retryForm.post(route('user.applications.retry-payment', props.application.id), {
        preserveScroll: true,
        onStart: () => console.log('Retrying payment...'),
        onFinish: () => console.log('Retry request finished.'),
    });
};
</script>

<template>
    <Head>
        <title>Taarifa za Ombi #{{ application.id }}</title>
    </Head>

    <div class="py-8 md:py-12 bg-gray-100 min-h-full">
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

            <!-- Retry Payment Button -->
            <div v-if="canRetryPayment" class="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg print:hidden">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-bold text-yellow-800">Malipo Bado Hayajakamilika</p>
                        <p class="text-sm text-yellow-700">Kama hukupokea ombi la malipo au lilipotea, unaweza kujaribu tena.</p>
                    </div>
                    <button @click="retryPayment" :disabled="retryForm.processing" class="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-500 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25">
                        <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': retryForm.processing }" />
                        {{ retryForm.processing ? 'Inatuma...' : 'Jaribu Kulipa Tena' }}
                    </button>
                </div>
            </div>

            <!-- Receipt -->
            <div class="bg-white shadow-lg rounded-lg overflow-hidden font-sans">
                <div class="p-6 md:p-8">
                    <!-- Header -->
                    <div class="flex justify-between items-start border-b-2 border-dashed border-gray-300 pb-4 mb-6">
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">RISITI YA MAOMBI</h2>
                            <p class="text-xs text-gray-500 mt-1">TAPHE AWARDS</p>
                        </div>
                        <div class="text-right">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="statusDetails(application.status).class">
                                {{ statusDetails(application.status).text }}
                            </span>
                            <p class="text-xs text-gray-500 mt-1">Ombi #{{ application.id }}</p>
                        </div>
                    </div>

                    <!-- Application Details -->
                    <div class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-8">
                        <div class="text-gray-600">Jina la Mshiriki:</div>
                        <div class="text-gray-800 font-medium text-right">{{ application.applicant_name }}</div>

                        <div class="text-gray-600">Kategoria ya Tuzo:</div>
                        <div class="text-gray-800 font-medium text-right">{{ application.category?.name || 'Haijulikani' }}</div>

                        <div class="text-gray-600">Tarehe ya Ombi:</div>
                        <div class="text-gray-800 font-medium text-right">{{ formatDate(application.created_at) }}</div>
                    </div>

                    <!-- Transaction Details -->
                    <div class="mb-8" v-if="application.transaction">
                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">MAELEZO YA MALIPO</h3>
                        <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div class="text-gray-600">Njia ya Malipo:</div>
                            <div class="text-gray-800 font-medium text-right">{{ application.transaction.payment_method || '---' }}</div>

                            <div class="text-gray-600">Namba ya Simu:</div>
                            <div class="text-gray-800 font-medium text-right">{{ application.transaction.phone_number }}</div>

                            <div class="text-gray-600">Tarehe ya Muamala:</div>
                            <div class="text-gray-800 font-medium text-right">{{ formatDate(application.transaction.updated_at) }}</div>

                            <div class="text-gray-600 col-span-2 mt-2 pt-2 border-t border-dashed">Namba ya Muamala (Order ID):</div>
                            <div class="text-gray-800 font-mono text-xs col-span-2 text-right">{{ application.transaction.order_id }}</div>

                            <div class="text-gray-600 col-span-2">Rejea ya Mtoa Huduma:</div>
                            <div class="text-gray-800 font-mono text-xs col-span-2 text-right">{{ application.transaction.gateway_reference || '---' }}</div>
                        </div>
                    </div>

                    <!-- Totals -->
                    <div class="border-t-2 border-dashed border-gray-300 pt-4 mt-6 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Ada ya Fomu:</span>
                            <span class="text-gray-800">TZS {{ new Intl.NumberFormat().format(application.transaction?.amount || 0) }}</span>
                        </div>
                        <div class="flex justify-between mt-2 font-bold text-base">
                            <span class="text-gray-900">JUMLA:</span>
                            <span class="text-gray-900">TZS {{ new Intl.NumberFormat().format(application.transaction?.amount || 0) }}</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="text-center mt-8 pt-4 border-t border-gray-200">
                        <p class="text-xs text-gray-500">Asante kwa kushiriki katika Tuzo za TAPHE.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media print {
    .print\:hidden { display: none; }
    body { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact;
        background-color: #fff;
    }
}
</style>