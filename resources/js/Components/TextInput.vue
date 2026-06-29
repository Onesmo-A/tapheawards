<script setup>
import { onMounted, ref } from 'vue';

const model = defineModel({
    type: String,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        class="bg-gray-900/50 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-gold-400 focus:ring focus:ring-gold-400 focus:ring-opacity-50 rounded-md shadow-sm"
        v-model="model"
        ref="input"
    />
</template>