<script setup>
import { Transition } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    altText: {
        type: String,
        default: 'Gallery Image',
    },
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
    <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" @click.self="close">
            <button @click="close" class="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
                <XMarkIcon class="h-8 w-8" />
            </button>

            <Transition
                enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
                <img v-if="show" :src="imageUrl" :alt="altText" class="relative max-w-4xl max-h-[90vh] w-full object-contain rounded-lg shadow-2xl" @click.stop />
            </Transition>
        </div>
    </Transition>
</template>