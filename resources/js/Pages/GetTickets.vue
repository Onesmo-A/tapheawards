<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AppHeader from '@/Components/Layout/AppHeader.vue';
import AppFooter from '@/Components/Layout/AppFooter.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';

defineProps({
  title: String,
});

const ticketTiers = [
  {
    name: 'Normal Ticket',
    price: 'TSh 100,000',
    description: 'per person',
    features: [
      'Guaranteed Event Access',
      'Standard Seating Arrangement',
      'Welcome Drink',
      'Access to Gala Dinner Buffet'
    ],
    isFeatured: false,
  },
  {
    name: 'VIP Ticket',
    price: 'TSh 200,000',
    description: 'per person',
    features: [
      'All Normal Ticket Benefits',
      'Premium Seating Area',
      'Red Carpet Access & Photo Op',
      'Exclusive VIP Lounge Access'
    ],
    isFeatured: true,
  },
  {
    name: 'Normal Table',
    price: 'TSh 1,000,000',
    description: 'for 8 guests',
    features: [
      'Dedicated Table for 8 Guests',
      'Standard Table Placement',
      'Company/Group Mention During Event',
      'Includes All Normal Ticket Benefits for Guests'
    ],
    isFeatured: false,
  },
  {
    name: 'VIP Table',
    price: 'TSh 2,000,000',
    description: 'for 8 guests',
    features: [
      'Dedicated Table for 8 Guests',
      'Prime Front Row Seating',
      'Personalized Butler Service',
      'Complimentary Champagne Bottle',
      'Includes All VIP Ticket Benefits for Guests'
    ],
    isFeatured: false,
  },
];
</script>

<template>
  <Head :title="title" />
  <AppHeader />

  <main>
    <!-- Page Header -->
    <PageHeader :title="title" />

    <!-- Tickets Section -->
    <section class="bg-black py-20 sm:py-32 text-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base font-semibold leading-7 uppercase" style="color: var(--accent-color)">Choose Your Experience</h2>
          <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl text-primary-gradient">
            Secure Your Place at the Gala
          </p>
          <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-400">
            Join us for an unforgettable night celebrating business excellence. Select the package that best suits you.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          <div
            v-for="tier in ticketTiers"
            :key="tier.name"
            :class="[
              'relative flex flex-col rounded-2xl p-8 shadow-2xl shadow-black/30 border-2 transition-all duration-300 hover:transform hover:-translate-y-2',
              tier.isFeatured ? 'bg-gray-900/50 border-[var(--primary-color)] hover:shadow-[var(--primary-color)]/20' : 'bg-gray-900/20 border-[var(--accent-color)]/20'
            ]"
          >
            <div v-if="tier.isFeatured" class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span class="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold text-white" style="background-color: var(--primary-color)">Most Popular</span>
            </div>

            <h3 class="text-2xl font-bold text-white">{{ tier.name }}</h3>
            <p class="mt-4 text-4xl font-bold tracking-tight text-primary-gradient">{{ tier.price }}</p>
            <p class="mt-1 text-sm text-gray-400">{{ tier.description }}</p>

            <ul role="list" class="mt-8 space-y-3 text-md leading-6 text-gray-300 flex-grow">
              <li v-for="feature in tier.features" :key="feature" class="flex gap-x-3">
                <svg class="h-6 w-5 flex-none" style="color: var(--primary-color)" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clip-rule="evenodd" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <Link
              href="#"
              :class="[
                '!mt-10 !text-lg',
                tier.isFeatured ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              Purchase Ticket
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped></style>