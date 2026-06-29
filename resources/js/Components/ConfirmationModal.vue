<script setup>
import Modal from '@/Components/Modal.vue';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);
</script>

<template>
    <Modal :show="show" @close="$emit('close')" max-width="sm">
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">
                <slot name="title" />
            </h2>

            <div class="mt-2 text-sm text-gray-600">
                <slot name="content" />
            </div>

            <div class="mt-6 flex justify-end">
                <slot name="footer" />
            </div>
        </div>
    </Modal>
</template>