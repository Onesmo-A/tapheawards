<script setup>
import { Head, Link } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import ExclamationTriangleIcon from '@/Components/Icons/ExclamationTriangleIcon.vue';

defineProps({
    errorMessage: String,
});
</script>

<template>
    <Head title="Tayari Umeshatuma Pendekezo Hili" />
    <GuestLayout>
        <div class="py-12 bg-background-section">
            <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-lg sm:rounded-lg p-8 text-center">
                    <div class="flex justify-center mb-4">
                        <ExclamationTriangleIcon class="h-16 w-16 text-yellow-500" />
                    </div>

                    <h1 class="text-3xl font-bold text-accent drop-shadow-title">Tayari Umeshatuma Pendekezo Hili</h1>

                    <p class="mt-4 text-lg text-text-secondary">
                        {{ errorMessage }}
                    </p>

                    <p class="mt-6 text-text-secondary">
                        Endelea kutembelea website yetu. Tufuatilie pia kupitia mitandao ya kijamii.
                    </p>

                    <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link :href="route('nominees.suggest')" class="btn-secondary w-full sm:w-auto">
                            Pendekeza Mwingine
                        </Link>
                        <Link href="/" class="btn-primary w-full sm:w-auto">
                            Rudi Mwanzo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

<style scoped>
.btn-secondary:hover {
    background-color: var(--accent-primary);
    color: white;
}
</style>