<script setup>
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { useSponsors } from '@/Composables/useSponsors';

import FacebookIcon from '@/Components/Icons/FacebookIcon.vue';
import TwitterIcon from '@/Components/Icons/TwitterIcon.vue';
import InstagramIcon from '@/Components/Icons/InstagramIcon.vue';
import LinkedInIcon from '@/Components/Icons/LinkedInIcon.vue';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon.vue';
import TikTokIcon from '@/Components/Icons/TikTokIcon.vue';
import YouTubeIcon from '@/Components/Icons/YouTubeIcon.vue';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/solid';

const { sponsors } = useSponsors();

const socialLinks = [
    { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/taphe_awards?igsh=MTZ2cHhhbTdvNm56OQ%3D%3D&utm_source=qr', 
    icon: InstagramIcon 
  },
  { name: 'WhatsApp', href: 'https://wa.me/+255749562993', icon: WhatsAppIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@yourtiktokhandle', icon: TikTokIcon },
];
</script>

<template>
  <footer class="bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-300">
    <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <!-- Logo and About -->
        <div class="space-y-4">
          <Link href="/">
            <ApplicationLogo class="h-12 w-auto" />
          </Link>
          <p class="text-xl font-semibold text-red-500">TAPHE AWARDS</p>
          <p class="text-sm leading-6">
            Celebrating excellence and innovation in the Tanzanian Health Sector.
          </p>
        </div>

<!-- Quick Links -->
<div>
  <h3 class="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
  <ul class="mt-4 space-y-3">
    <li><Link :href="route('about')" class="transition-colors hover:text-red-400">About</Link></li>
    <!-- Updated Categories link -->
    <li><Link :href="route('categories.index')" class="transition-colors hover:text-red-400">Categories</Link></li>
    <li><Link :href="route('participate')" class="transition-colors hover:text-red-400">Participate</Link></li>
    <li><Link :href="route('tickets.index')" class="transition-colors hover:text-red-400">Get Tickets</Link></li>
    <li><Link :href="route('sponsors.index')" class="transition-colors hover:text-red-400">Sponsors</Link></li>
    <li><Link :href="route('nominees.suggest')" class="transition-colors hover:text-red-400">Pendekeza Mshiriki</Link>
</li>
  </ul>
</div>


     <!-- Contact Info -->
<div>
  <h3 class="text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h3>
  <ul class="mt-4 space-y-3 text-sm">
    <li class="flex items-center">
      <MapPinIcon class="h-5 w-5 text-red-500 flex-shrink-0" />
      <span class="ml-3">Dar es Salaam, Tanzania</span>
    </li>
    <li class="flex items-center">
      <EnvelopeIcon class="h-5 w-5 text-red-500 flex-shrink-0" />
      <a href="mailto:info@tapheawards.co.tz" class="ml-3 hover:text-red-400">info@tapheawards.co.tz</a>
    </li>
    <li class="flex items-center">
      <PhoneIcon class="h-5 w-5 text-red-500 flex-shrink-0" />
      <a href="tel:+255749562993" class="ml-3 hover:text-red-400">+255 749 562 993</a>
    </li>
  </ul>
</div>
        <!-- Social Media Section -->
        <div class="md:col-start-4">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-white">Follow Us</h3>
          <p class="mt-4 text-sm">Stay updated with the latest news and announcements.</p>
          <div class="mt-4 flex space-x-5">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-red-500"
            >
              <span class="sr-only">{{ social.name }}</span>
              <component :is="social.icon" class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="mt-12 space-y-2 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} TAPHE Awards. All Rights Reserved.</p>
        <p>
          Design and Developed by 
          <a 
            href="https://wa.me/255743331626" 
            target="_blank" 
            rel="noopener" 
            class="font-semibold text-red-500 hover:underline"
          >
            Native Technology Ltd | +255 743 331 626
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-sponsor-logo {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 2px solid #ef4444; /* red-500 */
  background: #fff;
  object-fit: contain;
  padding: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
</style>
