<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import ContactForm from '@/Components/Contact/ContactForm.vue';
import GoogleMap from '@/Components/Contact/GoogleMap.vue';

defineOptions({
  layout: DefaultLayout,
});
</script>

<template>
  <Head title="Contact Us" />
  
  <PageHeader 
    title="Get in Touch"
    subtitle="We'd love to hear from you"
  />

  <section class="py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <ContactForm />
        
        <!-- Map & Info -->
        <div>
          <GoogleMap />
          <!-- Location details -->
        </div>
      </div>
    </div>
  </section>
</template>
