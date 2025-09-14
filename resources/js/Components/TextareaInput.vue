<script setup>
import { ref, watch } from 'vue';

// Props kutoka kwa parent component
const props = defineProps({
    modelValue: String,
    rows: {
        type: Number,
        default: 5,
    },
    placeholder: {
        type: String,
        default: '',
    },
});

// Emit ili kufuata v-model
const emit = defineEmits(['update:modelValue']);

// Ref ya input
const inputValue = ref(props.modelValue || '');
const wordLimit = 40;
const warning = ref('');

// Watch props.modelValue ili kudumisha synch
watch(() => props.modelValue, (newVal) => {
    inputValue.value = newVal || '';
});

// Function ya kudhibiti input
function onInput(e) {
    let words = e.target.value.trim().split(/\s+/);

    if (words.length > wordLimit) {
        words = words.slice(0, wordLimit);
        warning.value = `Umefika kikomo cha maneno ${wordLimit}.`;
    } else {
        warning.value = '';
    }

    inputValue.value = words.join(' ');
    emit('update:modelValue', inputValue.value);
}
</script>

<template>
    <div>
        <textarea
            :rows="rows"
            :placeholder="placeholder"
            class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full p-2"
            :value="inputValue"
            @input="onInput"
        ></textarea>
        <p v-if="warning" class="text-sm text-red-500 mt-1">{{ warning }}</p>
    </div>
</template>

<style scoped>
textarea {
    resize: vertical;
}
</style>
