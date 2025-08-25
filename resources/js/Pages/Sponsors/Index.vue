<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineOptions({
  layout: DefaultLayout,
});
</script>

<template>
  <Head title="Our Sponsors" />
  
  <PageHeader 
    title="Our Sponsors"
    subtitle="Meet the organizations supporting business excellence"
  />

  <section class="py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Sponsors Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Add sponsor logos and details -->
      </div>
    </div>
  </section>
</template>