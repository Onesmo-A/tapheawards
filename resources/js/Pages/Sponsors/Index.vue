<script setup>
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import PageHeader from '@/Components/Layout/PageHeader.vue';
import { useSponsors } from '@/Composables/useSponsors';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

defineOptions({
  layout: DefaultLayout,
});

// Data ya viwango vya udhamini na gradients za kisasa
const sponsorshipTiers = [
  {
    tier: 'Title Sponsor',
    price: 'TZS 50,000,000',
    description: 'The pinnacle of partnership, offering exclusive naming rights and unparalleled brand integration.',
    benefits: [
      'Exclusive naming rights as the Main Sponsor',
      'Premium branding on all event materials',
      'Recognition on our social platforms',
      'Logo placement on award trophies & certificates.',
      'Company listed prominently on our website with a direct link to your company',
      'Recognition in all Event press releases, social media, and national media coverage.',
      'Space for ad in our bulletin board on Event Day',
      'Corporate banner (supplied by sponsor) hung at both ends',
      'Promotion meeting discussion',
      '50 complementary tickets for employees to attend the awards.',
      'Priority choice of up to 3 award categories to sponsor and the same Awards presentation opportunity  ',
      '10 minutes Opportunity to speak on Event Day',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Title%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-red-400 via-white-500 to-red-600 text-white shadow-2xl-600 via-red-700 to-maroon-800 text-white shadow-2xl',
      button: 'bg-red-700 hover:bg-red-800 text-white text-maroon-700 hover:bg-gray-100 font-semibold',
      icon: 'text-white-300',
    },
    featured: true,
  },
  {
    tier: 'Platinum Sponsor',
    price: 'TZS 30,000,000',
    description: 'A premium sponsorship level with high-impact visibility and significant promotional benefits.',
    benefits: [
      'Premium logo placement on event materials & media promotions.',
      'Corporate banner (supplied by sponsor) hung at both ends',
      'Space for ad in our bulletin board on Event Day',
      'Recognition on our social platforms',
      'Recognition on Event Day',
      'Company listed prominently on our website with a direct link to your company',
      '40 complementary tickets for employees to attend the awards.',
      '2 Awards presentation opportunity ',
      'Recognition by MC during presentation of the award ',
      '5 minutes Opportunity to speak on Event Day',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Platinum%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-white to-gray via-gray-to-white-900 text-white shadow-lg',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-white font-semibold',
      icon: 'text-gray-900',
    },
    featured: false,
  },
  {
    tier: 'Gold Sponsor',
    price: 'TZS 20,000,000',
    description: 'A major sponsorship package ensuring strong brand presence and recognition.',
    benefits: [
      'Logo on event backdrop & program booklet',
      'Recognized on Event Day',
      'Recognition on our social platforms',
      'Company listed prominently on our website with a direct link to your company',
      'Space for ad in our bulletin board on Event Day',
      'Company promoted throughout duration of the week before Event',
      '30 complementary tickets for employees to attend the awards.',
      'Recognition by MC during presentation of the award',
      '1 Award presentation opportunity',
      '3 minutes speaking slot at the ceremony',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Gold%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 shadow-md',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white font-semibold',
      icon: 'text-yellow-600',
    },
    featured: false,
  },
  {
    tier: 'Silver Sponsor',
    price: 'TZS 10,000,000',
    description: 'A valuable package for supporters looking for significant brand exposure.',
    benefits: [
      'Recognition on our social platforms',
      'Space for ad on our bulletin board on Event Day',
      'Company listed prominently on our website with a direct link to your company',
      '20 complementary tickets for employees to attend the awards.',
      'Recognition by MC during presentation of the award',
      '1 Award presentation opportunity',
      '2 minutes speaking slot at the ceremony',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Silver%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 text-gray-900 shadow-sm',
      button: 'bg-gray-500 hover:bg-gray-600 text-white font-semibold',
      icon: 'text-gray-700',
    },
    featured: false,
  },
  {
    tier: 'Category Sponsor',
    price: 'TZS 5,000,000',
    description: 'Associate your brand with a specific award category for targeted recognition.',
    benefits: [
      'Naming rights for one specific award category',
      'Logo on stage screen and program booklet during category announcement.',
      'Recognition by MC during presentation of the award',
      'Recognition on our social platforms',
      'Business logo ad for company',
      '10 complimentary tickets for employees',
      'Sponsored category Award presentation opportunity',
      '1 minute speaking slot at the ceremony',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Category%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 text-white shadow-sm',
      button: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
      icon: 'text-blue-200',
    },
    featured: false,
  },
  {
    tier: 'Support Sponsor',
    price: 'TZS 3,000,000',
    description: 'Show your support for the healthcare community and gain valuable brand mention.',
    benefits: [
      'Logo on shared appreciation banner.',
      'Mention on social media as a supporting partner.',
      '5 complementary tickets for employees to attend the awards.',
    ],
    cta: 'https://wa.me/255749562993?text=I%27m%20interested%20in%20the%20Support%20Sponsor%20package.',
    style: {
      card: 'bg-gradient-to-br from-green-400 via-green-300 to-green-500 text-white shadow-sm',
      button: 'bg-green-600 hover:bg-green-700 text-white font-semibold',
      icon: 'text-green-200',
    },
    featured: false,
  },
];

// Current sponsors
const { sponsors } = useSponsors();
</script>

<template>
  <Head title="Sponsorship"/>


  <div class="bg-gray-50 mt-16">
    <div class="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-base font-semibold text-red-600 tracking-wide uppercase">Sponsorship Opportunities</h2>
        <p class="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
          Join Us for Succesful Event
        </p>
        <p class="max-w-3xl mt-5 mx-auto text-xl text-gray-500">
         To make this event a successfull one, we need your support. Your inputs shall help in programming by working in clear parameters.</p>
      </div>

      <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="tier in sponsorshipTiers" :key="tier.tier" class="relative p-8 rounded-3xl flex flex-col transition-transform duration-300 hover:scale-105" :class="tier.style.card">
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2" :class="{'text-white': tier.featured, 'text-gray-900': !tier.featured}">{{ tier.tier }}</h3>
            <p v-if="tier.featured" class="absolute top-0 -translate-y-1/2 bg-red-700 text-white px-4 py-1 text-sm font-semibold tracking-wide rounded-full shadow-lg">Most Popular</p>
            <p class="mt-4 flex items-baseline" :class="{'text-gray-100': tier.featured, 'text-gray-900': !tier.featured}">
              <span class="text-4xl font-extrabold tracking-tight">{{ tier.price }}</span>
            </p>
            <p class="mt-6 text-gray-100" :class="{'text-gray-200': tier.featured, 'text-gray-500': !tier.featured}">{{ tier.description }}</p>

            <ul role="list" class="mt-6 space-y-3">
              <li v-for="benefit in tier.benefits" :key="benefit" class="flex items-start">
                <CheckCircleIcon class="flex-shrink-0 w-6 h-6 mt-1" :class="tier.style.icon" aria-hidden="true" />
                <span class="ml-3 text-sm sm:text-base" :class="{'text-gray-200': tier.featured, 'text-gray-500': !tier.featured}">{{ benefit }}</span>
              </li>
            </ul>
          </div>
          <a :href="tier.cta" target="_blank"
             :class="[tier.style.button, 'mt-6 py-3 px-6 rounded-lg text-center text-sm sm:text-base transition-all duration-300']">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
