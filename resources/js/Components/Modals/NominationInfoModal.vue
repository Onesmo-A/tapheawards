<script setup>
import Modal from '@/Components/Modal.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

<template>
    <Modal :show="show" @close="closeModal" max-width="md">
        <div class="p-8 bg-white rounded-2xl shadow-xl text-center">
            <!-- Header -->
            <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                Taarifa Muhimu!
            </h2>

            <!-- Body -->
            <div class="mt-4 space-y-4 text-gray-700 text-base md:text-lg">
                <p>Online application zitaanza hivi punde.</p>
                <p>Wahi sasa! Hii ni fursa yako adimu kushiriki kwenye Tuzo za Afya.</p>
                <p>
                    Kujisajili kwa njia ya kawaida, piga namba hii 
                    <strong class="text-2xl text-blue-600 md:text-3xl">0749 562 993</strong> 
                    kuomba Kategory za Tuzo.
                </p>
            </div>

            <!-- Footer / Close button -->
            <div class="mt-8 flex justify-center">
                <SecondaryButton class="px-6 py-3 text-lg md:text-xl" @click="closeModal">
                    Funga
                </SecondaryButton>
            </div>
        </div>
    </Modal>
</template>
