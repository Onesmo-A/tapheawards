<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { useAuth } from '@/Composables/useAuth'; // Ongeza hii

const isMobileMenuOpen = ref(false);
const isAwardsDropdownOpen = ref(false);
const isMediaDropdownOpen = ref(false);
const mobileSubMenuOpen = ref('');
const isScrolled = ref(false);
const { isAuthenticated, user, logout } = useAuth(); // Tumia composable yetu

const navigation = [
  { name: 'Home', href: route('home') },
  { name: 'Categories', href: route('categories.index') },
  { name: 'About', href: route('about') },
];

const awardsDropdownLinks = [
  { name: 'All Awards', href: route('awards.index'), description: 'Browse all award seasons and winners.' },
  { name: 'Participate', href: route('participate'), description: 'Join the competition as a nominee.' },
  { name: 'Winners', href: route('awards.index'), description: 'See past winners and their achievements.' },
  { name: 'Get Tickets', href: route('tickets.index'), description: 'Attend the prestigious gala event.' },
  { name: 'Vote', href: route('categories.index'), description: 'Cast your vote for your favorite nominees.' },
];

const mediaDropdownLinks = [
  { name: 'News', href: route('news.index'), description: 'Latest updates & articles about the awards.' },
  { name: 'Gallery', href: route('gallery.index'), description: 'Photos & videos from our events.' },
  { name: 'Guest of Honor', href: route('event.guest-of-honor'), description: 'Learn about our special guest.' },
  { name: 'Contact Us', href: route('contact.show'), description: 'Get in touch with our team.' },
];

const handleLogout = async () => {
  await logout();
};

const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const closeMobileMenu = () => { isMobileMenuOpen.value = false; };
const handleScroll = () => { isScrolled.value = window.scrollY > 20; };
const closeAllDropdowns = () => {
  isAwardsDropdownOpen.value = false;
  isMediaDropdownOpen.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>


<template>
  <header
    :class="[ 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-x-clip',
      isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent',
    ]"
    @mouseleave="closeAllDropdowns"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <Link :href="route('home')">
            <ApplicationLogo class="h-10 w-auto" />
          </Link>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center space-x-1 ml-auto">
          <Link
            v-for="item in navigation"
            :key="item.name"
            :href="item.href"
            class="px-3 py-2 text-white font-medium hover:text-[var(--primary-color)] transition"
          >{{ item.name }}</Link>

          <button
            @mouseover="isAwardsDropdownOpen = true; isMediaDropdownOpen = false"
            class="group inline-flex items-center px-3 py-2 text-white font-medium hover:text-[var(--primary-color)] transition"
          >
            <span>Awards</span>
            <ChevronDownIcon class="ml-2 h-5 w-5" :class="{ 'rotate-180': isAwardsDropdownOpen }" />
          </button>

          <button
            @mouseover="isMediaDropdownOpen = true; isAwardsDropdownOpen = false"
            class="group inline-flex items-center px-3 py-2 text-white font-medium hover:text-[var(--primary-color)] transition"
          >
            <span>More</span>
            <ChevronDownIcon class="ml-2 h-5 w-5" :class="{ 'rotate-180': isMediaDropdownOpen }" />
          </button>
        </nav>

        <!-- Auth Buttons -->
        <div class="hidden lg:flex items-center space-x-4 ml-6">
          <!-- KWA WATUMIAJI WALIOINGIA -->
          <template v-if="isAuthenticated && user">
            <span class="text-base font-medium text-white">Habari, {{ user.name.split(' ')[0] }}!</span>
            <button @click="handleLogout" class="btn-primary !text-sm !px-4 !py-2">Log Out</button>
          </template>
          <!-- KWA WAGENI -->
          <template v-else>
            <Link :href="route('login')" class="text-base font-medium text-white hover:text-[var(--primary-color)] transition">Sign In</Link>
            <Link :href="route('register')" class="btn-primary !text-sm !px-4 !py-2">
              Sign Up
            </Link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex lg:hidden">
          <button @click="toggleMobileMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-black/95 px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <!-- Main Links -->
        <Link v-for="item in navigation" :key="item.name" :href="item.href" @click="closeMobileMenu" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">
          {{ item.name }}
        </Link>

        <!-- Awards Accordion -->
        <div>
          <button @click="mobileSubMenuOpen = mobileSubMenuOpen === 'awards' ? '' : 'awards'" class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">
            <span>Awards</span>
            <ChevronDownIcon class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': mobileSubMenuOpen === 'awards' }" />
          </button>
          <div v-show="mobileSubMenuOpen === 'awards'" class="pt-2 pb-1 pl-5 space-y-1">
            <Link v-for="item in awardsDropdownLinks" :key="item.name" :href="item.href" @click="closeMobileMenu" class="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[var(--primary-color)] hover:bg-gray-700">
              {{ item.name }}
            </Link>
          </div>
        </div>

        <!-- More Accordion -->
        <div>
          <button @click="mobileSubMenuOpen = mobileSubMenuOpen === 'media' ? '' : 'media'" class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">
            <span>More</span>
            <ChevronDownIcon class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': mobileSubMenuOpen === 'media' }" />
          </button>
          <div v-show="mobileSubMenuOpen === 'media'" class="pt-2 pb-1 pl-5 space-y-1">
            <Link v-for="item in mediaDropdownLinks" :key="item.name" :href="item.href" @click="closeMobileMenu" class="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[var(--primary-color)] hover:bg-gray-700">
              {{ item.name }}
            </Link>
          </div>
        </div>

        <!-- Auth buttons -->
        <div class="border-t border-gray-700 pt-4 pb-3 space-y-2">
          <template v-if="isAuthenticated && user">
            <span class="block px-3 py-2 rounded-md text-base font-medium text-white">Habari, {{ user.name.split(' ')[0] }}!</span>
            <button @click="handleLogout" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">Log Out</button>
          </template>
          <template v-else>
            <Link :href="route('login')" @click="closeMobileMenu" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">Sign In</Link>
            <Link :href="route('register')" @click="closeMobileMenu" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-[var(--primary-color)] hover:bg-gray-800">Sign Up</Link>
          </template>
        </div>
      </div>
    </transition>

    <!-- Awards Mega Dropdown -->
    <transition name="fade">
      <div v-show="isAwardsDropdownOpen" class="absolute left-0 top-20 w-screen z-40">
        <div class="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white">
          <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              v-for="item in awardsDropdownLinks"
              :key="item.name"
              :href="item.href"
              @click="closeAllDropdowns"
              class="hover:text-[var(--primary-color)] transition-colors"
            >
              <p class="font-semibold" style="color: var(--primary-color)">{{ item.name }}</p>
              <p class="text-sm text-gray-300">{{ item.description }}</p>
            </Link>
          </div>
        </div>
      </div>
    </transition>

    <!-- Media Mega Dropdown -->
    <transition name="fade">
      <div v-show="isMediaDropdownOpen" class="absolute left-0 top-20 w-screen z-40">
        <div class="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white">
          <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              v-for="item in mediaDropdownLinks"
              :key="item.name"
              :href="item.href"
              @click="closeAllDropdowns"
              class="hover:text-[var(--primary-color)] transition-colors"
            >
              <p class="font-semibold" style="color: var(--primary-color)">{{ item.name }}</p>
              <p class="text-sm text-gray-300">{{ item.description }}</p>
            </Link>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.bg-black\/80 {
  background-color: rgba(0, 0, 0, 0.8);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
