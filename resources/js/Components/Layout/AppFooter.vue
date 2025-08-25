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

// Pata orodha ya wadhamini kutoka kwenye composable yetu
const { sponsors } = useSponsors();

// Unaweza kubadilisha links hizi na kuweka links zako halisi
const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/yourpage', icon: FacebookIcon },
  { name: 'Twitter', href: 'https://twitter.com/yourhandle', icon: TwitterIcon },
  { name: 'Instagram', href: 'https://instagram.com/yourprofile', icon: InstagramIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/yourcompany', icon: LinkedInIcon },
  { name: 'WhatsApp', href: 'https://wa.me/yournumber', icon: WhatsAppIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@yourtiktokhandle', icon: TikTokIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/yourchannelid', icon: YouTubeIcon },
];
</script>

<template>
  <footer class="bg-black border-t border-[var(--secondary-color)] text-gray-400">
    <div class="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Logo and About -->
        <div class="space-y-4">
          <Link href="/">
            <ApplicationLogo />
          </Link>
          <p class="text-xl font-semibold text-primary-gradient">TAPHE AWARDS</p>
          <p class="text-sm">
            Celebrating excellence and innovation in the Tanzanian Health Sector.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
          <ul class="mt-4 space-y-3">
            <li><Link :href="route('about')" class="hover:text-[var(--accent-color)] transition-colors">About</Link></li>
            <li><Link href="#categories" class="hover:text-[var(--accent-color)] transition-colors">Categories</Link></li>
            <li><Link :href="route('participate')" class="hover:text-[var(--accent-color)] transition-colors">Participate</Link></li>
            <li><Link :href="route('tickets.index')" class="hover:text-[var(--accent-color)] transition-colors">Get Tickets</Link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Contact Us</h3>
          <ul class="mt-4 space-y-3">
            <li class="flex items-start">
              <span>📍</span>
              <span class="ml-3">Dar es Salaam, Tanzania</span>
            </li>
            <li class="flex items-start">
              <span>📧</span>
              <a href="mailto:info@tapheawards.co.tz" class="ml-3 hover:text-[var(--accent-color)] transition-colors">info@tapheawards.co.tz</a>
            </li>
            <li class="flex items-start">
              <span style="color: var(--accent-color)">📞</span>
              <a href="tel:+255652724557" class="ml-3 hover:text-[var(--accent-color)] transition-colors">+255 652 724 557</a>
               </li>
          </ul>
        </div>

        <!-- Social Media Section -->
        <div class="md:col-start-4">
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider">Follow Us</h3>
          <p class="mt-4 text-sm">Stay updated with the latest news and announcements.</p>
          <div class="flex space-x-5 mt-4">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-[var(--accent-color)] transition-transform duration-300 hover:scale-110"
            >
              <span class="sr-only">{{ social.name }}</span>
              <component :is="social.icon" class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <!-- Sponsors in Footer -->
      <div class="mt-16 pt-8 border-t border-[var(--secondary-color)]">
        <h3 class="text-center text-sm font-semibold text-white uppercase tracking-wider">
          Our Sponsored Partners
        </h3>
        <div class="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
          <a v-for="sponsor in sponsors" :key="sponsor.name" href="#" target="_blank" rel="noopener" class="flex items-center">
            <img 
              :src="sponsor.logo" 
              :alt="sponsor.name" 
              class="footer-sponsor-logo transition-all duration-300"
            >
          </a>
        </div>
      </div>

<div class="mt-12 border-t border-[var(--secondary-color)] pt-8 text-center text-sm space-y-2">
  <p>&copy; {{ new Date().getFullYear() }} TAPHE Awards. All Rights Reserved.</p>
  <p>Design and Developed by 
    <a 
      href="https://wa.me/255743331626" 
      target="_blank" 
      rel="noopener" 
      class="font-semibold hover:underline" style="color: var(--accent-color)"
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
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid var(--accent-color, #FFD700);
  background: white;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  display: inline-block;
}
</style>
