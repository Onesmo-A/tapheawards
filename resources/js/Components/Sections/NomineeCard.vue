<script setup>
import { useVote } from '@/Composables/useVote';

const props = defineProps({
  nominee: {
    type: Object,
    required: true,
  },
  // Hii prop itasaidia kuzima button kwa kategoria nzima baada ya kura moja kupigwa
  hasVotedInCategory: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['vote-successful']);

// Tumia composable kwa logiki yote ya kura
const { isLoading, message, messageType, castVote: performVote } = useVote();

const handleVote = async () => {
  // Ite `performVote` kutoka kwenye composable
  const voteWasSuccessfulOrAlreadyCasted = await performVote(props.nominee.id);
  if (voteWasSuccessfulOrAlreadyCasted) {
    emit('vote-successful');
  }
};
</script>

<template>
  <div class="group relative flex flex-col bg-gradient-to-br from-gray-900 to-black border border-yellow-400/30 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
    <!-- Nominee Image -->
    <div class="aspect-[4/5] bg-gray-900">
      <img
        :src="nominee.image_url"
        :alt="nominee.name"
        class="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition duration-300"
        loading="lazy"
        decoding="async"
        width="400" height="500"
      >
    </div>

    <!-- Nominee Details -->
    <div class="p-6 flex flex-col flex-grow">
      <h3 class="text-xl font-bold text-white mt-2 drop-shadow-gold">
        {{ nominee.name }}
      </h3>

      <p class="text-gray-400 mt-2 text-sm flex-grow line-clamp-4">
        {{ nominee.bio }}
      </p>

      <!-- Voting Button -->
      <div class="mt-6 pt-4 border-t border-white/10">
        <button
          @click="handleVote"
          :disabled="isLoading || hasVotedInCategory"
          class="w-full bg-gold-gradient text-[#422D03] font-bold py-3 px-4 rounded-lg shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
        >
          <span v-if="isLoading">Inapokea kura...</span>
          <span v-else-if="hasVotedInCategory">Umeshapiga Kura</span>
          <span v-else>Vote Now</span>
        </button>

        <!-- Sehemu ya Kuonyesha Ujumbe -->
        <div v-if="message" class="mt-3 text-center text-sm font-medium" :class="{ 'text-green-400': messageType === 'success', 'text-red-400': messageType === 'error' }">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-gold {
  border-color: #FFD700;
}
.text-gold {
  color: #FFD700;
}
.drop-shadow-gold {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
}
.bg-gold-gradient {
  /* Gradient ya dhahabu halisi yenye mng'ao */
  background: linear-gradient(145deg, #46381a 0%, #b48811 20%, #fcf3a8 50%, #b48811 80%, #46381a 100%);
  background-size: 250% 100%;
  transition: background-position 0.5s ease-in-out;
}

.bg-gold-gradient:hover:not(:disabled) {
    background-position: 100% 0;
}
.shadow-gold {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
</style>
