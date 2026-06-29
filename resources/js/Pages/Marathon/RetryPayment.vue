<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import { computed } from 'vue';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    registration: {
        type: Object,
        required: true,
    },
    transaction: {
        type: Object,
        required: true,
    },
});

const form = useForm({
    order_id: props.transaction.order_id,
});

const submit = () => {
    form.post(route('marathon.process-retry-payment'), {
        preserveScroll: true,
    });
};

const formattedAmount = computed(() => {
    return new Intl.NumberFormat('en-US').format(props.transaction.amount);
});

</script>

<template>
    <Head title="Kamilisha Malipo ya Marathon" />

    <main class="bg-background-section py-16 sm:py-24 pt-32 md:pt-40">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                    <ExclamationTriangleIcon class="h-10 w-10 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>

                <h3 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Malipo Bado Hayajakamilika</h3>
                
                <div class="mt-2 text-gray-600 dark:text-gray-400">
                    <p>Habari <strong class="font-semibold">{{ registration.full_name }}</strong>, inaonekana usajili wako wa marathon bado haujalipiwa.</p>
                </div>

                <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Kiasi cha kulipa ni:</p>
                    <div class="my-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                        <p class="text-3xl font-bold tracking-widest text-primary">{{ formattedAmount }} TZS</p>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Ombi la malipo litatumwa kwenye namba <strong class="font-semibold">{{ registration.phone_number }}</strong>.
                    </p>
                </div>

                <div class="mt-8">
                    <form @submit.prevent="submit">
                        <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            <span v-if="form.processing">Inatuma Ombi...</span>
                            <span v-else>Lipa Sasa</span>
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>