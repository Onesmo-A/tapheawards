<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Head, router, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { TransitionRoot } from '@headlessui/vue';
import axios from 'axios';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    transaction: {
        type: Object,
        required: true,
    },
});

const paymentStatus = ref('pending');
const checkingStatus = ref(true);
let intervalId = null;

const checkPaymentStatus = async () => {
    try {
        checkingStatus.value = true;
        const response = await axios.post(route('marathon.check-status'), {
            order_id: props.transaction.order_id,
        });

        const newStatus = response.data.status;

        if (newStatus === 'completed') {
            paymentStatus.value = 'completed';
            if (intervalId) clearInterval(intervalId);
            setTimeout(() => {
                router.visit(route('marathon.success', { order_id: props.transaction.order_id }));
            }, 2000);
        } else if (['failed', 'cancelled', 'expired', 'initiation_failed'].includes(newStatus)) {
            paymentStatus.value = 'failed';
            if (intervalId) clearInterval(intervalId);
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
        if (error.response && error.response.status === 404) {
            paymentStatus.value = 'failed';
            clearInterval(intervalId);
        }
    } finally {
        checkingStatus.value = false;
    }
};

onMounted(() => {
    checkPaymentStatus();
    intervalId = setInterval(checkPaymentStatus, 8000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

const statusInfo = computed(() => {
    switch (paymentStatus.value) {
        case 'completed':
            return {
                icon: CheckCircleIcon,
                iconClass: 'text-green-500',
                bgClass: 'bg-green-100 dark:bg-green-900/50',
                title: 'Malipo Yamekamilika!',
                message: 'Umefanikiwa kulipia. Tunakuelekeza kwenye ukurasa wa mafanikio...'
            };
        case 'failed':
            return {
                icon: ExclamationTriangleIcon,
                iconClass: 'text-red-500',
                bgClass: 'bg-red-100 dark:bg-red-900/50',
                title: 'Malipo Yameshindikana',
                message: 'Muamala haujakamilika. Huenda kuna tatizo la mtandao au salio halitoshi.'
            };
        default:
            return {
                icon: null,
                iconClass: '',
                bgClass: 'bg-yellow-100 dark:bg-yellow-900/50',
                title: 'Kamilisha Malipo',
                message: `Ombi la malipo limetumwa kwenye namba 
                    <strong class="font-bold text-red-500 dark:text-red-400">
                        ${props.transaction.phone_number}
                    </strong>. Tafadhali thibitisha muamala kwenye simu yako.`
            };
    }
});

const formattedAmount = computed(() => {
    return new Intl.NumberFormat('en-US').format(props.transaction.amount);
});
</script>

<template>
    <Head title="Subiri Malipo" />

    <main class="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen py-12 pt-40">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
            <TransitionRoot
                :show="true"
                as="template"
                appear
                enter="transform transition-all duration-500 ease-out"
                enter-from="opacity-0 scale-95 translate-y-4"
                enter-to="opacity-100 scale-100 translate-y-0"
            >
                <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
                    
                    <!-- Spinner / Icons -->
                    <div class="relative h-20 w-20 mx-auto">
                        <div v-if="paymentStatus === 'pending'" class="absolute inset-0 flex items-center justify-center">
                            <!-- Spinner ya mishale inayozunguka -->
                            <svg class="animate-spin h-12 w-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" 
                                        stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" 
                                      d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"></path>
                            </svg>
                        </div>

                        <div v-else class="absolute inset-0 flex items-center justify-center">
                            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full" :class="statusInfo.bgClass">
                                <component 
                                    :is="statusInfo.icon" 
                                    class="h-12 w-12"
                                    :class="statusInfo.iconClass"
                                    aria-hidden="true" 
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">{{ statusInfo.title }}</h3>
                    
                    <!-- Message -->
                    <div class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p v-html="statusInfo.message"></p>
                    </div>

                    <!-- Pending Info -->
                    <div v-if="paymentStatus === 'pending'" class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Kiasi cha kulipa:</p>
                            <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ formattedAmount }} TZS</p>
                        </div>
                        <div class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg v-if="checkingStatus" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" 
                                        stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" 
                                      d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"></path>
                            </svg>
                            <span>{{ checkingStatus ? 'Tunaangalia hali ya malipo...' : 'Ukurasa huu utasasishwa malipo yakikamilika.' }}</span>
                        </div>
                    </div>

                    <!-- Failed Action -->
                    <div v-if="paymentStatus === 'failed'" class="mt-8">
                        <Link :href="route('marathon.register')" 
                              class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Jaribu Kujisajili Tena
                        </Link>
                    </div>
                </div>
            </TransitionRoot>
        </div>
    </main>
</template>
