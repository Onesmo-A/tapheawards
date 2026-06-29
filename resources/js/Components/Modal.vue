<!-- resources/js/Components/Modal.vue -->
<template>
  <Teleport to="body">
    <transition name="modal" appear>
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 relative">
          <div class="px-6 py-4">
            <slot />
          </div>
          <button
            @click="$emit('close')"
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
defineEmits(['close']);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
