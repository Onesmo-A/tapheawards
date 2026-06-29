<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null,
  },
  accept: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);

function handleFileChange(e) {
  const file = e.target.files[0];
  emit('update:modelValue', file || null);
}

// ukipewa modelValue mpya kutoka nje, update input value
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal && fileInput.value) {
      fileInput.value.value = null; // clear file input
    }
  }
);
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
    :accept="accept"
    @change="handleFileChange"
  />
</template>
