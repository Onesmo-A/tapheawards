<script setup>
import { h, ref, computed, onMounted, onUnmounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
 
// Icons
import DashboardIcon from '@/Components/Icons/DashboardIcon.vue';
import CategoryIcon from '@/Components/Icons/CategoryIcon.vue';
import NomineeIcon from '@/Components/Icons/NomineeIcon.vue';
import LogoutIcon from '@/Components/Icons/LogoutIcon.vue';
import MenuIcon from '@/Components/Icons/MenuIcon.vue';
import CloseIcon from '@/Components/Icons/CloseIcon.vue';
import ChevronLeftIcon from '@/Components/Icons/ChevronLeftIcon.vue';
import UserCircleIcon from '@/Components/Icons/UserCircleIcon.vue';
import ReportIcon from '@/Components/Icons/ReportIcon.vue';
import CogIcon from '@/Components/Icons/CogIcon.vue'; 
import { DocumentTextIcon, CurrencyDollarIcon, NewspaperIcon } from '@heroicons/vue/24/outline';

import Sidebar from '@/Layouts/Partials/Sidebar.vue';
const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);

const page = usePage();
const user = computed(() => page.props.auth.user);
const userInitial = computed(() => (user.value && user.value.name) ? user.value.name.charAt(0).toUpperCase() : '');

const openSubMenu = ref('');

function closeSideMenu() {
    mobileSidebarOpen.value = false;
}

const handleResize = () => {
  if (window.innerWidth >= 1024) { // lg breakpoint
    mobileSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const menuItems = [
    { name: 'Dashboard', route: 'admin.dashboard', icon: DashboardIcon, children: [] },
    {
        name: 'Content Management',
        icon: CategoryIcon,
        key: 'content',
        children: [
            { name: 'Categories', route: 'admin.categories.index', icon: CategoryIcon, activePattern: 'admin.categories.*' },
            { name: 'Nominees', route: 'admin.nominees.index', icon: NomineeIcon, activePattern: 'admin.nominees.*' },
            { name: 'Posts', route: 'admin.posts.index', icon: NewspaperIcon, activePattern: 'admin.posts.*' },
        ]
    },
    // BORESHO: Ongeza menu group kwa ajili ya Applications na Transactions
    {
        name: 'User Interactions',
        icon: DocumentTextIcon,
        key: 'interactions',
        children: [
            { name: 'Applications', route: 'admin.applications.index', icon: DocumentTextIcon, activePattern: 'admin.applications.*' },
            { name: 'Transactions', route: 'admin.transactions.index', icon: CurrencyDollarIcon, activePattern: 'admin.transactions.*' },
            { name: 'Suggestions', route: 'admin.suggestions.index', icon: ReportIcon, activePattern: 'admin.suggestions.*' },
            // BORESHO: Ongeza menu group kwa ajili ya Invitations
            {
                name: 'Invitations',
                route: 'admin.invitations.index',
                icon: () => h('i', { class: 'fas fa-envelope w-6 h-6 text-gray-500' }), // Using FontAwesome icon
                activePattern: 'admin.invitations.*'
            },
        ]
    },
    {
        name: 'Voting Management',
        icon: NomineeIcon,
        key: 'voting',
        children: [
            { name: 'Vote List', route: 'admin.votes.index', icon: DashboardIcon, activePattern: 'admin.votes.*' },
        ]
    },
    {
        name: 'Reports',
        icon: ReportIcon,
        key: 'reports',
        children: [
            { name: 'Nominee Report', route: 'admin.nominees.export', icon: ReportIcon, activePattern: 'admin.nominees.export' },
            { name: 'Results Report (PDF)', route: 'admin.categories.export.all-pdf', icon: ReportIcon, activePattern: 'admin.categories.export.*' },
        ]
    },
    {
        name: 'Mipangilio',
        route: 'admin.settings.index',
        icon: CogIcon,
        children: []
    },
    {
        name: 'Tangaza Washindi',
        route: 'admin.winners.index',
        icon: () => h('i', { class: 'fas fa-trophy w-6 h-6 text-gray-500' }),
        children: []
    }
];

const logout = () => {
    router.post(route('logout'));
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-300">
        <FlashMessage />
        <!-- Sidebar -->
        <Sidebar :sidebarOpen="sidebarOpen" :mobileSidebarOpen="mobileSidebarOpen" :menuItems="menuItems" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <!-- Main -->
        <div class="flex flex-col flex-1 transition-all duration-300 ease-in-out" :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'">
            <header class="sticky top-0 z-20 flex items-center justify-between h-20 px-4 sm:px-8 bg-gray-900/70 backdrop-blur-lg border-b border-gold-500/20">
                <button @click="mobileSidebarOpen = !mobileSidebarOpen" class="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none">
                    <MenuIcon v-if="!mobileSidebarOpen" class="h-6 w-6" />
                    <CloseIcon v-else class="h-6 w-6" />
                </button>
                <div class="hidden lg:block">
                    <!-- Optional search bar -->
                </div>
                <div v-if="user" class="flex items-center ml-auto">
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <button class="flex items-center space-x-3 focus:outline-none">
                                <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gold-500 text-gray-900 font-bold text-lg">
                                    {{ userInitial }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <div class="font-bold text-sm text-gray-800 dark:text-gray-200">{{ user.name }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">Admin</div>
                                </div>
                            </button>
                        </template>
                        <template #content>
                            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ user.name }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
                            </div>
                            <DropdownLink :href="route('profile.edit')">
                                <UserCircleIcon class="mr-2 h-5 w-5" />
                                Profile
                            </DropdownLink>
                            <DropdownLink :href="route('logout')" method="post" as="button">
                                <LogoutIcon class="mr-2 h-5 w-5" />
                                Log Out
                            </DropdownLink>
                        </template>
                    </Dropdown>
                </div>
            </header>

            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                <div v-if="$slots.header" class="mb-6">
                    <slot name="header" />
                </div>
                <div class="bg-gray-800/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl p-6">
                    <slot />
                </div>
            </main>
        </div>

        <div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>
    </div>
</template>

<style scoped>
aside::-webkit-scrollbar {
    width: 4px;
}
aside::-webkit-scrollbar-track {
    background: #1f2937;
}
aside::-webkit-scrollbar-thumb {
    background-color: #d97706;
    border-radius: 20px;
}
</style>
