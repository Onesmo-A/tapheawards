<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    application: Object,
});

const statusInfo = computed(() => {
    // Hii itabadilika kulingana na status zako halisi
    switch (props.application.status) {
        case 'approved':
            return { text: 'Limekubaliwa', icon: CheckCircleIcon, color: 'text-green-400' };
        case 'rejected':
            return { text: 'Limekataliwa', icon: XCircleIcon, color: 'text-red-400' };
        default:
            return { text: 'Linashughulikiwa', icon: ClockIcon, color: 'text-yellow-400' };
    }
});

const formattedDate = computed(() => {
    return new Date(props.application.created_at).toLocaleDateString('sw-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
</script>

<template>
    <div class="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center justify-between space-x-4 transition-all hover:border-gray-600">
        <div class="flex-1">
            <p class="font-bold text-gray-200">{{ application.category.name }}</p>
            <p class="text-sm text-gray-400">Liliwasilishwa: {{ formattedDate }}</p>
        </div>
        <div class="flex items-center space-x-2" :class="statusInfo.color">
            <component :is="statusInfo.icon" class="h-5 w-5" />
            <span class="text-sm font-medium">{{ statusInfo.text }}</span>
        </div>
        <!-- TODO: Badilisha route hii ielekee kwenye ukurasa wa kuona ombi kamili -->
        <Link href="#" class="p-2 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors">
            <ArrowRightIcon class="h-5 w-5" />
        </Link>
    </div>
</template>