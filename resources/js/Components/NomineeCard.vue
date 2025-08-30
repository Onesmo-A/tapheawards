<script setup>
import VoteButton from '@/Components/VoteButton.vue';
import { Facebook, Instagram, QrCode } from 'lucide-vue-next';
import { ref } from 'vue';
import QRCode from 'qrcode';

// Props
const props = defineProps({
  nominee: {
    type: Object,
    required: true,
  },
  categoryUrl: { // Pass the category URL from parent page
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  }
});

// QR Modal State
const showQR = ref(false);
const qrDataUrl = ref('');

// Function to generate QR code
const generateQR = async () => {
  try {
    qrDataUrl.value = await QRCode.toDataURL(props.categoryUrl);
    showQR.value = true;
  } catch (err) {
    console.error('Failed to generate QR code', err);
  }
};

// Close QR modal
const closeQR = () => {
  showQR.value = false;
};
</script>

<template>
  <div
    class="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-red-600 
           transform transition-transform duration-300 ease-in-out hover:-translate-y-2 flex flex-col overflow-hidden group w-full max-w-sm"
  >
    <!-- Image -->
    <div class="relative">
      <img
        class="w-full h-64 object-cover object-top"
        :src="nominee.image_url"
        :alt="nominee.name"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <h3 class="absolute bottom-0 left-0 p-4 text-2xl sm:text-3xl font-bold text-white">
        {{ nominee.name }}
      </h3>
    </div>

    <!-- Bio + Social + Vote -->
    <div class="p-6 flex flex-col items-center flex-grow text-center">
      <p class="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 min-h-[60px]">
        {{ nominee.bio }}
      </p>

      <!-- Social Links -->
      <div class="flex items-center gap-4 mb-4">
        <a
          v-if="nominee.facebook_url"
          :href="nominee.facebook_url"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:opacity-80 transition"
        >
          <Facebook class="w-6 h-6 text-blue-600" />
        </a>

        <a
          v-if="nominee.instagram_url"
          :href="nominee.instagram_url"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:opacity-80 transition"
        >
          <Instagram class="w-6 h-6 text-pink-500" />
        </a>

        <!-- QR Code Button -->
        <button
          @click="generateQR"
          class="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:bg-gray-200 transition"
          title="Print QR Code"
        >
          <QrCode class="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <!-- Vote Button -->
      <VoteButton :nominee="nominee" />
    </div>
  </div>

  <!-- QR Code Modal -->
  <div v-if="showQR" @click.self="closeQR" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl p-6 relative max-w-sm w-full">
      <button @click="closeQR" class="absolute top-2 right-2 text-gray-700 font-bold text-lg">&times;</button>
      <div class="text-center mb-4">
        <h3 class="text-lg font-bold text-gray-900">TAPHE Awards 2025</h3>
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