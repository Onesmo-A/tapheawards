<script setup>
import VoteButton from '@/Components/VoteButton.vue';
import { Facebook, Instagram } from 'lucide-vue-next';

const props = defineProps({
  nominee: {
    type: Object,
    required: true,
  },
  voteSession: {
    type: Object,
    default: null,
  },
  hasVotedInCategory: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="group relative flex flex-col bg-gradient-to-br from-gray-900 to-black border border-yellow-400/30 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
    <div class="relative aspect-[4/5] bg-gray-900">
      <img
        :src="nominee.image_url"
        :alt="nominee.name"
        class="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition duration-300"
        loading="lazy"
        decoding="async"
        width="400"
        height="500"
      >
      <div class="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">
        <a
          v-if="nominee.facebook_url"
          :href="nominee.facebook_url"
          target="_blank"
          rel="noopener noreferrer"
          class="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-blue-400 transition hover:bg-white/20"
        >
          <Facebook class="h-4 w-4" />
        </a>
        <a
          v-if="nominee.instagram_url"
          :href="nominee.instagram_url"
          target="_blank"
          rel="noopener noreferrer"
          class="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-pink-400 transition hover:bg-white/20"
        >
          <Instagram class="h-4 w-4" />
        </a>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <h3 class="text-xl font-bold text-white mt-2 drop-shadow-gold">
        {{ nominee.name }}
      </h3>

      <p class="text-gray-400 mt-2 text-sm flex-grow line-clamp-4">
        {{ nominee.bio }}
      </p>

      <div class="mt-6 pt-4 border-t border-white/10">
        <VoteButton
          :nominee="nominee"
          :vote-session="voteSession"
          :disabled="hasVotedInCategory"
        />
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
</style>
