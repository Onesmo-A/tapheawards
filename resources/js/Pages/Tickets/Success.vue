<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    purchase: Object,
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(value);
};
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div class="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
            
            <CheckCircleIcon class="mx-auto h-20 w-20 text-green-500" />

            <h1 class="mt-6 text-3xl font-extrabold text-gray-900">
                Hongera, Malipo Yamekamilika!
            </h1>
            <p class="mt-2 text-gray-600">
                Asante, {{ purchase.purchaser_name }}, kwa kununua tiketi za TAPHE Awards.
            </p>

            <div class="mt-8 text-left bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <h2 class="text-lg font-bold text-gray-800 border-b pb-2">Muhtasari wa Manunuzi</h2>
                
                <div class="flex justify-between">
                    <span class="text-gray-600">Namba ya Muamala:</span>
                    <span class="font-mono text-sm font-semibold text-gray-800">{{ purchase.transaction.order_id }}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-600">Aina ya Tiketi:</span>
                    <span class="font-semibold text-gray-800">{{ purchase.ticket_type.name }}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-600">Idadi:</span>
                    <span class="font-semibold text-gray-800">{{ purchase.quantity }}</span>
                </div>

                <div class="flex justify-between text-xl font-bold text-gray-900 border-t pt-4 mt-4">
                    <span>Jumla Iliyolipwa:</span>
                    <span class="text-green-600">{{ formatCurrency(purchase.total_amount) }}</span>
                </div>
            </div>

            <div class="mt-8">
                <p class="text-gray-600">
                    Tiketi zako zimetumwa kwenye barua pepe uliyosajili: <strong class="text-gray-800">{{ purchase.purchaser_email }}</strong>.
                </p>
                <div class="mt-6 space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
                    <a :href="route('tickets.download', { order_id: purchase.transaction.order_id })" class="btn-primary w-full sm:w-auto">
                        Pakua Tiketi (PDF)
                    </a>
                    <Link :href="route('home')" class="btn-secondary w-full sm:w-auto">
                        Rudi Mwanzo
                    </Link>
                </div>
            </div>

        </div>
    </div>
</template>