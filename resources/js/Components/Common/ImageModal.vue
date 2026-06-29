<!-- ImageModal.vue -->
<script setup>
import { ref } from 'vue';

const props = defineProps({
  imageUrl: String,
});

const isOpen = ref(true);

function closeModal() {
  isOpen.value = false;
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="relative">
      <img :src="imageUrl" class="max-w-full max-h-screen rounded-lg" />
      <button @click="closeModal" class="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full">X</button>
    </div>
  </div>
</template>
