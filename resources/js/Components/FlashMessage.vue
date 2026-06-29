<script setup>
import { computed, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';

const page = usePage();
const message = computed(() => page.props.flash?.success || null);
const show = computed(() => !!message.value);

watch(message, () => {
    if (show.value) {
        setTimeout(() => {
            page.props.flash.success = null;
        }, 3000);
    }
});
</script>

<template>
    <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
        <div v-if="show" class="fixed top-5 right-5 z-50 max-w-sm w-full bg-green-500 bg-opacity-80 backdrop-blur-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-white">{{ message }}</p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>