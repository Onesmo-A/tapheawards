<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { useAuth } from '@/Composables/useAuth';

const isMobileMenuOpen = ref(false);
const isAwardsDropdownOpen = ref(false);
const isMediaDropdownOpen = ref(false);
const mobileSubMenuOpen = ref('');
const isScrolled = ref(false);

const { isAuthenticated, user, logout } = useAuth();

const navigation = [
  { name: 'Home', href: route('home') },
  { name: 'Categories', href: route('categories.index') },
  { name: 'Sponsors', href: route('sponsors.index') },
  { name: 'About', href: route('about') },
];

const awardsMegaMenu = [
    {
        title: 'The Awards',
        links: [
            { name: 'All Awards', href: route('awards.index'), description: 'Browse all award seasons and winners.' },
            { name: 'Winners', href: route('awards.index'), description: 'See past winners and their achievements.' },
            { name: 'Vote', href: route('categories.index'), description: 'Cast your vote for your favorite nominees.' },
        ]
    },
    {
        title: 'Get Involved',
        links: [
            { name: 'Participate', href: route('participate'), description: 'Join the competition as a nominee.' },
            { name: 'Suggest a Nominee', href: route('nominees.suggest'), description: 'Propose a deserving individual for an award.' },
            { name: 'Get Tickets', href: route('tickets.index'), description: 'Attend the prestigious gala event.' },
        ]
    }
];

const moreMegaMenu = [
    {
        title: 'Media',
        links: [
            { name: 'News', href: route('news.index'), description: 'Latest updates & articles about the awards.' },
            { name: 'Gallery', href: route('gallery.index'), description: 'Photos & videos from our events.' },
        ]
    },
    {
        title: 'Event & Info',
        links: [
            { name: 'Guest of Honor', href: route('event.guest-of-honor'), description: 'Learn about our special guest.' },
            { name: 'Contact Us', href: route('contact.show'), description: 'Get in touch with our team.' },
        ]
    }
];

// For mobile menu, we need a flat list.
const flatAwardsLinks = computed(() => awardsMegaMenu.flatMap(col => col.links));
const flatMoreLinks = computed(() => moreMegaMenu.flatMap(col => col.links));

const handleLogout = async () => {
  await logout();
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};
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
  :class="[
    'fixed top-[2.5rem] md:top-10 left-0 right-0 z-40 transition-all duration-300 ease-in-out overflow-x-clip',
    isScrolled
      ? 'bg-[var(--background-main)]/95 backdrop-blur-md shadow-lg'
      : 'bg-[var(--background-main)] shadow-sm',
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
            class="px-3 py-2 font-medium transition text-[var(--text-primary)] hover:text-[var(--text-accent)]"
          >
            {{ item.name }}
          </Link>

          <button
            @mouseover="isAwardsDropdownOpen = true; isMediaDropdownOpen = false"
            class="group inline-flex items-center px-3 py-2 font-medium transition text-[var(--text-primary)] hover:text-[var(--text-accent)]"
          >
            <span>Awards</span>
            <ChevronDownIcon class="ml-2 h-5 w-5 transition-transform" :class="{ 'rotate-180': isAwardsDropdownOpen }" />
          </button>

          <button
            @mouseover="isMediaDropdownOpen = true; isAwardsDropdownOpen = false"
            class="group inline-flex items-center px-3 py-2 font-medium transition text-[var(--text-primary)] hover:text-[var(--text-accent)]"
          >
            <span>More</span>
            <ChevronDownIcon class="ml-2 h-5 w-5 transition-transform" :class="{ 'rotate-180': isMediaDropdownOpen }" />
          </button>
        </nav>

        <!-- Auth Buttons -->
        <div class="hidden lg:flex items-center space-x-4 ml-6">
          <template v-if="isAuthenticated && user">
            <span class="text-base font-medium text-[var(--text-primary)]">Habari, {{ user.name.split(' ')[0] }}!</span>
            <button @click="handleLogout" class="btn-primary !text-sm !px-4 !py-2">Log Out</button>
          </template>
          <template v-else>
            <Link :href="route('login')" class="btn-primary text-base font-medium transition text-[var(--text-primary)] hover:text-[var(--text-accent)] ">Sign In</Link>
            <Link :href="route('register')" class="btn-secondary !text-sm !px-4 !py-2">Sign Up</Link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex lg:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100 focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Dropdown -->
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden bg-[var(--background-section)] px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 shadow-lg"
      >
        <Link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
        >
          {{ item.name }}
        </Link>

        <!-- Awards Accordion -->
        <div>
          <button
            @click="mobileSubMenuOpen = mobileSubMenuOpen === 'awards' ? '' : 'awards'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
          >
            <span>Awards</span>
            <ChevronDownIcon class="h-5 w-5 transition-transform" :class="{ 'rotate-180': mobileSubMenuOpen === 'awards' }" />
          </button>
          <div v-show="mobileSubMenuOpen === 'awards'" class="pt-2 pb-1 pl-5 space-y-1">
            <Link
              v-for="item in flatAwardsLinks"
              :key="item.name"
              :href="item.href"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
            >
              {{ item.name }}
            </Link>
          </div>
        </div>

        <!-- More Accordion -->
        <div>
          <button
            @click="mobileSubMenuOpen = mobileSubMenuOpen === 'media' ? '' : 'media'"
            class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
          >
            <span>More</span>
            <ChevronDownIcon class="h-5 w-5 transition-transform" :class="{ 'rotate-180': mobileSubMenuOpen === 'media' }" />
          </button>
          <div v-show="mobileSubMenuOpen === 'media'" class="pt-2 pb-1 pl-5 space-y-1">
            <Link
              v-for="item in flatMoreLinks"
              :key="item.name"
              :href="item.href"
              @click="closeMobileMenu"
              class="block px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
            >
              {{ item.name }}
            </Link>
          </div>
        </div>

        <!-- Auth buttons -->
        <div class="border-t border-gray-200 pt-4 pb-3 space-y-2">
          <template v-if="isAuthenticated && user">
            <span class="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)]">Habari, {{ user.name.split(' ')[0] }}!</span>
            <button
              @click="handleLogout"
              class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
            >
              Log Out
            </button>
          </template>
          <template v-else>
            <Link
              :href="route('login')"
              @click="closeMobileMenu"
              class="block btn-primary px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              :href="route('register')"
              @click="closeMobileMenu"
              class="btn-secondary block px-3 py-2 rounded-md text-base font-medium text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </template>
        </div>
      </div>
    </transition>

    <!-- Awards Mega Dropdown -->
    <transition name="fade">
      <div v-show="isAwardsDropdownOpen" class="absolute left-0 top-20 w-screen z-40">
        <div class="bg-[var(--background-section)] rounded-2xl shadow-primary-glow border-t-4 border-[var(--accent-primary)]">
          <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            <div v-for="column in awardsMegaMenu" :key="column.title">
              <p class="font-bold text-base text-gray-500 uppercase tracking-wider mb-4">{{ column.title }}</p>
              <ul class="space-y-4">
                <li v-for="item in column.links" :key="item.name">
                  <Link
                    :href="item.href"
                    @click="closeAllDropdowns"
                    class="group block transition-all hover:translate-x-1"
                  >
                    <p class="font-semibold text-[var(--text-accent)] text-lg group-hover:text-red-500">{{ item.name }}</p>
                    <p class="text-sm text-[var(--text-secondary)] mt-1">{{ item.description }}</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Media Mega Dropdown -->
    <transition name="fade">
      <div v-show="isMediaDropdownOpen" class="absolute left-0 top-20 w-screen z-40">
        <div class="bg-[var(--background-section)] rounded-2xl shadow-primary-glow border-t-4 border-[var(--accent-primary)]">
          <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            <div v-for="column in moreMegaMenu" :key="column.title">
              <p class="font-bold text-base text-gray-500 uppercase tracking-wider mb-4">{{ column.title }}</p>
              <ul class="space-y-4">
                <li v-for="item in column.links" :key="item.name">
                  <Link
                    :href="item.href"
                    @click="closeAllDropdowns"
                    class="group block transition-all hover:translate-x-1"
                  >
                    <p class="font-semibold text-[var(--text-accent)] text-lg group-hover:text-red-500">{{ item.name }}</p>
                    <p class="text-sm text-[var(--text-secondary)] mt-1">{{ item.description }}</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
