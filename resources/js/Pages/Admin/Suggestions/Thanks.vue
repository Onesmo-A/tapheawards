<script setup>
import { Head, Link } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import CheckCircleIcon from '@/Components/Icons/CheckCircleIcon.vue';

defineProps({
    successMessage: String,
});

const siteUrl = 'https://tapheawards.co.tz';
const instagramUrl = 'https://www.instagram.com/taphe_awards';
</script>

<template>
    <Head title="Asante Sana!" />
    <GuestLayout>
        <div class="py-12 bg-background-section">
            <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-lg sm:rounded-lg p-8 text-center">
                    <div class="flex justify-center mb-4">
                        <CheckCircleIcon class="h-16 w-16 text-green-500" />
                    </div>

                    <h1 class="text-3xl font-bold text-accent drop-shadow-title">Asante Sana!</h1>

                    <p class="mt-4 text-lg text-text-secondary">
                        {{ successMessage }}
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
.btn-secondary {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}
.btn-secondary:hover {
    background-color: var(--accent-primary);
    color: white;
}
</style>