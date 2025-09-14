<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import { useSponsors } from '@/Composables/useSponsors';

defineOptions({
  layout: DefaultLayout,
});

// Wadhamini sample data
const sponsorshipTiers = [
  {
    tier: 'Platinum',
    description: 'Exclusive main sponsor of TAPHE Awards 2025 with full branding visibility.',
    cta: 'https://wa.me/255749562993',
    color: 'bg-gradient-to-r from-red-600 to-red-400',
    logo: '/images/logo.png',
  },
  {
    tier: 'Gold',
    description: 'Major sponsor with high visibility across event materials.',
    cta: 'https://wa.me/255749562993',
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
    logo: '/images/logo.png',
  },
  {
    tier: 'Silver',
    description: 'Supporter of TAPHE Awards with logo placement in event materials.',
    cta: 'https://wa.me/255749562993',
    color: 'bg-gradient-to-r from-gray-400 to-gray-300',
    logo: '/images/logo.png',
  },
  {
    tier: 'Bronze',
    description: 'Community support sponsorship with logo mention.',
    cta: 'https://wa.me/255749562993',
    color: 'bg-gradient-to-r from-blue-500 to-blue-400',
    logo: '/images/logo.png',
  },
];

// Import current sponsors dynamically
const { sponsors } = useSponsors();
</script>

<template>
  <Head title="Our Sponsors" />

  <PageHeader
    title="Our Sponsors"
    subtitle="Meet the organizations supporting excellence in healthcare"
  />

  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
      
      <!-- Intro Text -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <h2 class="text-3xl font-extrabold text-gray-900">Sponsorship Opportunities</h2>
        <p class="text-lg text-gray-700">
          TAPHE Awards 2025 invites organizations, companies, and institutions to partner with us in celebrating healthcare excellence.
          Sponsorship provides visibility, recognition, and networking opportunities.
        </p>
      </div>

      <!-- Sponsorship Cards -->
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="tier in sponsorshipTiers"
          :key="tier.tier"
          class="rounded-xl shadow-lg overflow-hidden flex flex-col justify-between hover:scale-105 transition-transform duration-300"
        >
          <div :class="['p-6 flex flex-col items-center text-center space-y-4', tier.color]">
            <img 
              :src="tier.logo" 
              :alt="tier.tier + ' Sponsor'" 
              class="w-20 h-20 object-contain rounded-full border-2 border-white"
            />
            <h3 class="text-xl font-bold text-white">{{ tier.tier }} Sponsor</h3>
            <p class="text-sm text-white">{{ tier.description }}</p>
          </div>
          <div class="p-4 bg-white text-center">
            <a 
              :href="tier.cta"
              target="_blank"
              class="btn-primary inline-block w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Become a {{ tier.tier }} Sponsor
            </a>
          </div>
        </div>
      </div>

<!-- Current Sponsors Section -->
<div>
  <h3 class="text-2xl font-bold text-gray-900 text-center mb-6">Current Sponsors</h3>
  <div class="flex flex-wrap justify-center gap-4">
    <img 
      v-for="sponsor in sponsors" 
      :key="sponsor.id" 
      :src="sponsor.logo" 
      :alt="sponsor.name" 
      class="w-24 h-24 object-contain rounded-lg border p-1 bg-white shadow-sm"
    />
  </div>
</div>


    </div>
  </section>
</template>

<style scoped>
/* Optional: hover shadow for cards */
</style>
