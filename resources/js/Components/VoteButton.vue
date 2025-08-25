<script setup>
import { ref } from 'vue';
import { useVote } from '@/Composables/useVote';

const props = defineProps({
  nominee: {
    type: Object,
    required: true,
  },
});

// Tumia composable kwa logiki yote ya kura
const { isLoading, message, messageType, castVote: performVote } = useVote();
const hasVoted = ref(false);

const handleVote = async () => {
  // Ite `performVote` kutoka kwenye composable
  const voteWasSuccessfulOrAlreadyCasted = await performVote(props.nominee.id);
  if (voteWasSuccessfulOrAlreadyCasted) {
    hasVoted.value = true;
  }
};
</script>

<template>
  <div>
    <button
      @click="handleVote"
      class="w-full text-white font-bold py-3 px-4 rounded-lg shadow-primary-glow hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
      :disabled="isLoading || hasVoted"
    >
      <span v-if="isLoading">Inapokea kura...</span>
      <span v-else-if="hasVoted">Umeshapiga Kura</span>
      <span v-else>Vote</span>
    </button>

    <!-- Sehemu ya Kuonyesha Ujumbe -->
    <div v-if="message" class="mt-3 text-center text-sm font-medium" :class="{ 'text-green-400': messageType === 'success', 'text-red-400': messageType === 'error' }">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: var(--primary-color);
}
</style>
