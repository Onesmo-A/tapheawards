<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({
  layout: DefaultLayout,
});

const guestDetails = {
  name: '',
  title: '',
  image: '',
  bio: ''
};
</script>

<template>
  <Head title="Guest of Honor" />
  
  <PageHeader 
    title="Guest of Honor"
    subtitle="Meet our distinguished guest"
  />

  <section class="py-16 bg-black text-white">
    <div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
      <template v-if="guestDetails.name || guestDetails.title || guestDetails.image || guestDetails.bio">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div class="relative aspect-[4/3] rounded-xl overflow-hidden">
            <img 
              :src="guestDetails.image" 
              :alt="guestDetails.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-white">{{ guestDetails.name }}</h2>
            <p class="text-xl text-yellow-400">{{ guestDetails.title }}</p>
            <div class="prose prose-lg prose-invert">
              <p>{{ guestDetails.bio }}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <h2 class="text-3xl font-semibold mb-4">Mgeni rasmi atatangazwa hivi karibuni</h2>
        <p class="text-lg text-gray-300">Tafadhali endelea kutembelea tovuti yetu kwa taarifa zaidi.</p>
      </template>
    </div>
  </section>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animations that trigger when the parent .is-visible class is added */
.is-visible .animate-child-on-visible {
    opacity: 1;
    transform: translateY(0) translateX(0);
    transition: opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.animate-child-on-visible { transform: translateY(30px); }
.animate-child-on-visible.animate-from-left { transform: translateX(-50px); }
.animate-child-on-visible.animate-from-right { transform: translateX(50px); }
</style>
