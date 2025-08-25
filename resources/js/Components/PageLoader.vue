<script setup>
// Hakuna script inayohitajika kwa komponenti hii rahisi
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
    aria-busy="true"
    aria-live="polite"
  >
    <div
      class="h-16 w-16 animate-spin rounded-full border-4 border-solid border-red-500 border-t-transparent"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>