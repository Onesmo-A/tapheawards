<script setup>
import { PhoneIcon, EnvelopeIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 h-10 bg-red-600 text-white text-sm flex items-center">
    <div class="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
      <!-- Contact Info (Always visible) -->
      <div class="flex items-center space-x-4 mt-2">
        <a href="tel:+255749562993" class="flex items-center space-x-1 hover:text-yellow-400 transition duration-300">
          <PhoneIcon class="h-4 w-4 text-white"/>
          <span class="text-white">+255 749 562 993</span>
        </a>
        <a href="mailto:info@tapheawards.co.tz" class="flex items-center space-x-1 hover:text-yellow-400 transition duration-300">
          <EnvelopeIcon class="h-4 w-4 text-white"/>
          <span class="text-white">info@tapheawards.co.tz</span>
        </a>
      </div>

      <!-- Social Media Links (Desktop only) -->
      <div class="hidden md:flex items-center space-x-3 mt-2">
        <a href="#" target="_blank" class="hover:text-yellow-400 transition duration-300">
          <span class="sr-only">Facebook</span>
          <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
          </svg>
        </a>
        <a href="#" target="_blank" class="hover:text-yellow-400 transition duration-300">
          <span class="sr-only">Instagram</span>
          <svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.153 2.153c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.153 2.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.153-2.153c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.153-2.153c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118c-2.136 0-3.863 1.727-3.863 3.863s1.727 3.863 3.863 3.863 3.863-1.727 3.863-3.863S14.136 8.118 12 8.118zM12 14.17c-1.18 0-2.146-.966-2.146-2.146s.966-2.146 2.146-2.146 2.146.966 2.146 2.146S13.18 14.17 12 14.17zM16.838 7.162c-.596 0-1.078.482-1.078 1.078s.482 1.078 1.078 1.078 1.078-.482 1.078-1.078-.482-1.078-1.078-1.078z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
