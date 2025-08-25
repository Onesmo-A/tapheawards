<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    href: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
    },
});

const classes = computed(() =>
    props.active
? 'block w-full ps-3 pe-4 py-2 border-l-4 border-gold-400 text-start text-base font-medium text-gold-300 bg-gold-900/20 focus:outline-none focus:text-gold-200 focus:bg-gold-900/30 focus:border-gold-300 transition duration-150 ease-in-out'
        : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-400 hover:text-gold-300 hover:bg-gray-800 focus:outline-none focus:text-gold-300 focus:bg-gray-800 focus:border-gold-500 transition duration-150 ease-in-out'
);
</script>

<template>
    <Link :href="href" :class="classes">
        <slot />
    </Link>
</template>
