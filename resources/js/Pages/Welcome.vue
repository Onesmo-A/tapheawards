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
import Testimonials from '@/Components/Sections/Testimonials.vue';

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  categories: Object,
  title: String,
  description: String,
  settings: Object,
  heroSlides: Array, // NEW
});
</script>

<template>
  <Head>
    <title>{{ title }}</title>
    <meta name="description" :content="description" />
  </Head>

  <main>
    <!-- NEW: pitisha slides -->
    <HeroSection :title="title" :description="description" :slides="heroSlides" />

    <!-- Nomination Section -->
    <!-- TODO: Unaweza kuifanya hii section ionekane kwa condition, k.m. v-if="settings?.nomination_active" -->
    <NominationOpenSection />

    <CountDownSection
      v-if="settings?.voting_active && settings.voting_deadline"
      :end-date="settings.voting_deadline" />

    <CategorySlider
      v-if="categories && categories.data && categories.data.length > 0"
      :categories="categories.data" />
 <Testimonials />
    <WhyParticipateSection />
    <SponsorsSection />
    <GallerySection />
    <MapSection />
  </main>
</template>
