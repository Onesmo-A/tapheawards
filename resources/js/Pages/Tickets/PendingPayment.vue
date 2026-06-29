<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    transaction: Object,
});

const paymentStatus = ref('pending');
const pollingInterval = ref(null);
const countdown = ref(300); // 5 minutes

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(value);
};

const checkPaymentStatus = async () => {
    try {
        const response = await axios.get(route('tickets.status', { order_id: props.transaction.order_id }));
        paymentStatus.value = response.data.status;

        if (response.data.status === 'completed') {
            clearInterval(pollingInterval.value);
            router.visit(response.data.redirect_url);
        } else if (['failed', 'cancelled'].includes(response.data.status)) {
            clearInterval(polling_interval.value);
            // TODO: Redirect to a failure page or show a message
        }

    } catch (error) {
        console.error('Error checking payment status:', error);
        // Stop polling if there's a server error to avoid spamming
        if (error.response && error.response.status >= 500) {
            clearInterval(pollingInterval.value);
        }
    }
};

onMounted(() => {
    // Check status immediately, then every 5 seconds
    checkPaymentStatus();
    pollingInterval.value = setInterval(checkPaymentStatus, 5000);

    // Countdown timer
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            clearInterval(pollingInterval.value);
            paymentStatus.value = 'timeout';
        }
    }, 1000);

    onUnmounted(() => {
        clearInterval(pollingInterval.value);
        clearInterval(timer);
    });
});

const formattedCountdown = () => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div class="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
            
            <div class="animate-pulse">
                <svg class="mx-auto h-16 w-16 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
            </div>

            <h1 class="mt-6 text-2xl font-extrabold text-gray-900">
                Thibitisha Malipo Kwenye Simu Yako
            </h1>
            <p class="mt-2 text-gray-600">
                Ombi la malipo ya <strong class="text-gray-800">{{ formatCurrency(transaction.amount) }}</strong> limetumwa kwenye namba 
                <strong class="text-gray-800">{{ transaction.phone_number }}</strong>.
            </p>
            <p class="mt-4 text-sm text-gray-500">
                Tafadhali ingiza namba yako ya siri ili kukamilisha muamala. Usifunge ukurasa huu.
            </p>

            <div class="mt-8 bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">Hali ya Malipo:</p>
                <p class="text-lg font-bold uppercase" :class="{ 'text-yellow-600': paymentStatus === 'pending', 'text-red-600': paymentStatus === 'failed' }">
                    {{ paymentStatus === 'pending' ? 'Inasubiri...' : paymentStatus }}
                </p>
                <p v-if="paymentStatus === 'pending'" class="text-xs text-gray-400 mt-2">
                    Muda umebaki: {{ formattedCountdown() }}
                </p>
            </div>
        </div>
    </div>
</template>