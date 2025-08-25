<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import HeroSection from '@/Components/Sections/HeroSection.vue';
import WhyParticipateSection from '@/Components/Sections/WhyParticipateSection.vue';
import SponsorsSection from '@/Components/Sections/SponsorsSection.vue';
import CategorySlider from '@/Components/Sections/CategorySlider.vue';
import GallerySection from '@/Components/Sections/GallerySection.vue';
import MapSection from '@/Components/Sections/MapSection.vue';
import CountDownSection from '@/Components/Sections/CountdownSection.vue';

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

    <CountDownSection
      v-if="settings && (settings.voting_active === true || settings.voting_active == 1) && settings.voting_deadline"
      :end-date="settings.voting_deadline" />

    <CategorySlider
      v-if="categories && categories.data && categories.data.length > 0"
      :categories="categories.data" />

    <WhyParticipateSection />
    <SponsorsSection />
    <GallerySection />
    <MapSection />
  </main>
</template>
