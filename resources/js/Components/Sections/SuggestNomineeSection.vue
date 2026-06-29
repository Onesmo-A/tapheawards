<script setup>
import { Link } from '@inertiajs/vue3';
import PrimaryButton from '@/Components/PrimaryButton.vue';
</script>

<template>
    <section class="bg-background-section py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold tracking-tight text-accent sm:text-4xl drop-shadow-title">
                Je! Unamjua Shujaa Anayestahili Kushiri Tuzo?
            </h2>
            <p class="mt-6 text-lg leading-8 text-text-secondary max-w-2xl mx-auto">
                Tunathamini mchango wako katika kutambua watu na taasisi zinazoleta mabadiliko chanya. Pendekeza mshiriki ambaye unaamini anastahili kutambuliwa kwa kazi zake bora.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <Link :href="route('nominees.suggest')">
                    <PrimaryButton class="text-lg px-8 py-3 transform hover:scale-105 transition-transform duration-300">
                        Pendekeza Mshiriki Sasa
                    </PrimaryButton>
                </Link>
            </div>
        </div>
    </section>
</template>