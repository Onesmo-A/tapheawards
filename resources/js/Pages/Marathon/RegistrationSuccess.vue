<script setup>
import { Head, Link } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    registration: {
        type: Object,
        required: true,
    },
});

</script>

<template>
    <Head title="Usajili Umekamilika" />

    <main class="bg-background-section py-16 sm:py-24 pt-32 md:pt-40">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon class="h-10 w-10 text-green-600" aria-hidden="true" />
                </div>

                <h3 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Hongera, {{ registration.full_name }}!</h3>
                
                <div class="mt-2 text-gray-600 dark:text-gray-400">
                    <p>Usajili wako wa Taphe Awards Marathon umekamilika. Tumekutumia ujumbe mfupi (SMS) wenye taarifa zako.</p>
                </div>

                <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Namba yako ya kipekee ya ushiriki ni:</p>
                    <div class="my-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                        <p class="text-3xl font-bold tracking-widest text-primary">{{ registration.unique_code }}</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Tafadhali hifadhi namba hii, utaitumia kuchukua vifaa vyako vya mbio.</p>
                </div>

                <div class="mt-8">
                    <Link :href="route('home')" class="btn-primary">
                        Rudi Mwanzo
                    </Link>
                </div>
            </div>
        </div>
    </main>
</template>