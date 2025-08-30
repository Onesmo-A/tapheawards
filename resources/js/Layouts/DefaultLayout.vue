<script setup>
import TopBar from '@/Components/Layout/TopBar.vue';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
</script>

<template>
    <div class="bg-gray-50 min-h-screen flex flex-col">
        <TopBar />
        <AppHeader />

        <main class="flex-grow">
            <slot />
        </main>

        <AppFooter />
    </div>
</template>