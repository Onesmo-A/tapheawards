<script setup>
import { Head } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';

defineProps({
  title: String,
  description: String
});
</script>

<template>
  <div class="min-h-screen bg-black">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>