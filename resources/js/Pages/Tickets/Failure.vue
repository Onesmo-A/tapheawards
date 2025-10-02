<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { TransitionRoot } from '@headlessui/vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    transaction: Object,
});

const form = useForm({
    order_id: props.transaction.order_id,
});

const retryPayment = () => {
    form.post(route('tickets.retry-payment'), {
        preserveScroll: true,
        onStart: () => {
            // Unaweza kuonyesha spinner hapa
        },
    });
};

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
                    
                    <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                        <ExclamationTriangleIcon class="h-12 w-12 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>

                    <h3 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">{{ title }}</h3>
                    
                    <div class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>Samahani, inaonekana muamala wako haujakamilika. Hii inaweza kusababishwa na kukatisha muamala, kuchelewa kuweka namba ya siri, au tatizo la mtandao.</p>
                    </div>

                    <div class="mt-8 space-y-4">
                        <form @submit.prevent="retryPayment">
                            <PrimaryButton type="submit" class="w-full justify-center" :disabled="form.processing">
                                <ArrowPathIcon v-if="!form.processing" class="h-5 w-5 mr-2" />
                                {{ form.processing ? 'Inatuma ombi...' : 'Jaribu Kulipa Tena' }}
                            </PrimaryButton>
                        </form>
                        <Link :href="route('home')" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                            Rudi Mwanzo
                        </Link>
                    </div>
                </div>
            </TransitionRoot>
        </div>
    </main>
</template>