<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import HeroSection from '@/Components/Sections/HeroSection.vue';
import NominationOpenSection from '@/Components/Sections/NominationOpenSection.vue';
import WhyParticipateSection from '@/Components/Sections/WhyParticipateSection.vue';
import SponsorsSection from '@/Components/Sections/SponsorsSection.vue'; 
import CategorySlider from '@/Components/Sections/CategorySlider.vue';
import GallerySection from '@/Components/Sections/GallerySection.vue';
import MapSection from '@/Components/Sections/MapSection.vue';
import CountDownSection from '@/Components/Sections/CountdownSection.vue';
import TestimonialSection from '@/Components/Sections/TestimonialSection.vue';
import ReelsSection from '@/Components/Sections/ReelsSection.vue'; // NEW: Import Reels Section
import SponsorCallUpSection from '@/Components/Sections/SponsorshipCTASection.vue';
import SuggestNomineeSection from '@/Components/Sections/SuggestNomineeSection.vue';
import MarathonCTASection from '@/Components/Sections/MarathonCTASection.vue'; // NEW: Import Marathon Section

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  categories: Object,
  title: String,
  description: String,
  settings: Object,
   updates: Array,
  heroSlides: Array, // NEW
  reels: Array, // NEW: Ongeza reels prop
  testimonials: Array, // BORESHO: Ongeza testimonials prop
});
</script>
<template>
  <Head>
    <title>{{ title }}</title>
    <meta name="description" :content="description" />

    <!-- ================== MABORESHO YA SEO (Homepage) ================== -->
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tapheawards.co.tz/" />
    <meta property="og:title" :content="title" />
    <meta property="og:description" :content="description" />
    <meta property="og:image" content="https://tapheawards.co.tz/images/logo.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" :content="title" />
    <meta property="twitter:description" :content="description" />
    <meta property="twitter:image" content="https://tapheawards.co.tz/images/logo.png" />
  </Head>

  <main>
    <!-- NEW: pitisha slides -->
    <HeroSection :title="title" :description="description" :slides="heroSlides" />

    <!-- Nomination Section -->
    <!-- TODO: Unaweza kuifanya hii section ionekane kwa condition, k.m. v-if="settings?.nomination_active" -->
    <NominationOpenSection
        :title="settings.nomination_open_title"
        :dates="settings.nomination_open_dates"
    />
      <SponsorCallUpSection />
    <CountDownSection
      v-if="settings?.voting_active && settings.voting_deadline"
      :end-date="settings.voting_deadline" />

    <!-- NEW: Add Marathon Section -->
    <MarathonCTASection />

    <CategorySlider
      v-if="categories && categories.data && categories.data.length > 0"
      :categories="categories.data" />

    <!-- REKEBISHO: Pitisha data ya testimonials kwenye component -->
    <TestimonialSection :testimonials="testimonials" />

    <!-- NEW: Add Reels Section -->
    <ReelsSection :reels="reels" />

    <SuggestNomineeSection />
    <WhyParticipateSection />
    <SponsorsSection />
      <GallerySection  :updates="updates"/>
    <MapSection />
  </main>
</template>
