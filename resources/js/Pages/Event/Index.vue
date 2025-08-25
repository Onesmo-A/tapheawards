<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import EventSchedule from '@/Components/Event/EventSchedule.vue';

defineOptions({
  layout: DefaultLayout,
});

defineProps({
  event: Object
});
</script>

<template>
  <Head title="Event Details" />
  
  <PageHeader 
    title="Tanzania Business Awards 2025"
    subtitle="A Night of Excellence and Recognition"
  />

  <div class="relative py-16 bg-black">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Event Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h2 class="text-3xl font-bold text-white">The Most Prestigious Business Awards</h2>
          <p class="text-gray-400 text-lg">Join us for an evening celebrating excellence in Tanzanian business...</p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#schedule" class="btn-primary">View Schedule</a>
            <Link :href="route('tickets')" class="btn-secondary">Get Tickets</Link>
          </div>
        </div>

        <div class="relative">
          <CountdownTimer class="absolute top-4 right-4" />
          <img src="/images/event-venue.jpg" alt="Event Venue" class="rounded-xl shadow-2xl">
        </div>
      </div>

      <!-- Schedule Section -->
      <div id="schedule" class="mt-24">
        <EventSchedule :schedule="event.schedule" />
      </div>
    </div>
  </div>
</template>