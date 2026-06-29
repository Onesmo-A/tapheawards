<script setup>
import VoteButton from '@/Components/VoteButton.vue';
import { Check, Copy, Facebook, Instagram, QrCode } from 'lucide-vue-next';
import { ref } from 'vue';
import QRCode from 'qrcode';

// Props
const props = defineProps({
  nominee: {
    type: Object,
    required: true,
  },
  voteSession: {
    type: Object,
    default: null,
  },
  categoryUrl: { // Pass the category URL from parent page
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  votingEnabled: {
    type: Boolean,
    default: true,
  },
});

const canVote = () => props.votingEnabled && !props.nominee.is_suspended;

// QR Modal State
const showQR = ref(false);
const qrDataUrl = ref('');
const isCopyingLink = ref(false);
const linkCopied = ref(false);

// Function to generate QR code
const generateQR = async () => {
  try {
    qrDataUrl.value = await QRCode.toDataURL(props.categoryUrl);
    showQR.value = true;
  } catch (err) {
    console.error('Failed to generate QR code', err);
  }
};

const copyCategoryLink = async () => {
  const shareUrl = new URL(props.categoryUrl, window.location.origin).toString();

  try {
    isCopyingLink.value = true;
    await navigator.clipboard.writeText(shareUrl);
    linkCopied.value = true;

    window.setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy category link', err);
  } finally {
    isCopyingLink.value = false;
  }
};

// Close QR modal
const closeQR = () => {
  showQR.value = false;
};
</script>

<template>
  <div
    class="group flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_18px_45px_rgba(185,0,0,0.10)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(185,0,0,0.16)]"
  >
    <!-- Image -->
    <div class="relative aspect-[1/1] overflow-hidden bg-gray-100">
      <img
        class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        :src="nominee.image_url"
        :alt="nominee.name"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
      <h3 class="absolute bottom-4 left-4 right-4 text-lg sm:text-xl font-bold text-white drop-shadow-lg">
        {{ nominee.name }}
      </h3>
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
        <button
          @click="generateQR"
          class="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-800 transition hover:bg-white"
          title="Print QR Code"
        >
          <QrCode class="h-4 w-4" />
        </button>
        <button
          @click="copyCategoryLink"
          :disabled="isCopyingLink"
          class="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          :title="linkCopied ? 'Link copied' : 'Copy category link'"
        >
          <Check v-if="linkCopied" class="h-4 w-4 text-emerald-600" />
          <Copy v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Vote -->
    <div class="bg-white px-4 py-3 sm:px-5">
      <VoteButton v-if="canVote()" :nominee="nominee" :vote-session="voteSession" />
      <div
        v-else
        class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700"
      >
        <span v-if="nominee.is_suspended">Nominee suspended</span>
        <span v-else>Voting closed for this category</span>
      </div>
      <p v-if="linkCopied" class="mt-2 text-center text-xs font-medium text-emerald-600">
        Category link copied. Share it with voters.
      </p>
    </div>
  </div>

  <!-- QR Code Modal -->
  <div v-if="showQR" @click.self="closeQR" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 relative max-w-sm w-full">
      <button @click="closeQR" class="absolute top-2 right-2 text-gray-700 font-bold text-lg">&times;</button>
      <div class="text-center mb-4">
        <h3 class="text-lg font-bold text-gray-900">TAPHE Awards</h3>
        <p class="text-sm text-gray-600 mt-1">
          Scan to vote for <strong class="font-semibold">{{ nominee.name }}</strong>
          <br>
          in the <strong class="font-semibold">{{ categoryName }}</strong> category.
        </p>
      </div>
      <img :src="qrDataUrl" alt="QR Code" class="mx-auto mb-4" />
      <a :href="qrDataUrl" :download="`qr-code-${nominee.name.toLowerCase().replace(/\s+/g, '-')}.png`" class="btn-primary block text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Download QR
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Center content and buttons already handled by flex + items-center + justify-center */
</style>
