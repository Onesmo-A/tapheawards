<script setup>
import { h, ref, computed } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
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
import ChevronDownIcon from '@/Components/Icons/ChevronDownIcon.vue';
import CogIcon from '@/Components/Icons/CogIcon.vue';

const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);

const page = usePage();
const user = computed(() => page.props.auth.user);
const userInitial = computed(() => (user.value && user.value.name) ? user.value.name.charAt(0).toUpperCase() : '');

const openSubMenu = ref('');

const menuItems = [
    { name: 'Dashboard', route: 'admin.dashboard', icon: DashboardIcon, children: [] },
    {
        name: 'Content Management',
        icon: CategoryIcon,
        key: 'content',
        children: [
            { name: 'Categories', route: 'admin.categories.index', icon: CategoryIcon, activePattern: 'admin.categories.*' },
            { name: 'Nominees', route: 'admin.nominees.index', icon: NomineeIcon, activePattern: 'admin.nominees.*' },
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
    <div class="min-h-screen bg-gradient-dark-blue text-gray-300">
        <FlashMessage />
        <!-- Sidebar -->
        <aside :class="[
            'fixed inset-y-0 left-0 z-40 bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out',
            'lg:translate-x-0',
            sidebarOpen ? 'w-64' : 'w-20',
            mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'
        ]">
            <!-- Logo -->
            <div class="flex items-center h-20 px-6 border-b border-gray-800" :class="sidebarOpen ? 'justify-between' : 'justify-center'">
                <Link :href="route('admin.dashboard')" v-show="sidebarOpen || mobileSidebarOpen">
                    <ApplicationLogo class="h-10" />
                </Link>
                <button @click="sidebarOpen = !sidebarOpen" class="hidden lg:block p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500">
                    <ChevronLeftIcon class="w-6 h-6 transition-transform duration-300" :class="!sidebarOpen && 'rotate-180'" />
                </button>
            </div>

            <!-- Menu -->
            <nav class="mt-4 flex-1 space-y-1">
                <div v-for="item in menuItems" :key="item.name">
                    <Link v-if="!item.children.length"
                          :href="route(item.route)"
                          :class="[
                              'flex items-center py-3 transition-colors duration-200 relative',
                              sidebarOpen || mobileSidebarOpen ? 'px-6' : 'px-7 justify-center',
                              route().current(item.route) ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          ]"
                          :title="!(sidebarOpen || mobileSidebarOpen) ? item.name : ''">
                        <span v-if="route().current(item.route)" class="absolute inset-y-0 left-0 w-1 bg-gold-500 rounded-r-lg"></span>
                        <component :is="item.icon" class="w-6 h-6" :class="[route().current(item.route) ? 'text-gold-400' : 'text-gray-500']" />
                        <span class="ml-4" v-show="sidebarOpen || mobileSidebarOpen">{{ item.name }}</span>
                    </Link>

                    <div v-else>
                        <button @click="openSubMenu = (openSubMenu === item.key ? '' : item.key)"
                                :class="[
                                    'w-full flex items-center text-left py-3 transition-colors duration-200 relative',
                                    sidebarOpen || mobileSidebarOpen ? 'px-6' : 'px-7 justify-center',
                                    item.children.some(c => route().current(c.activePattern)) ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                ]">
                            <span v-if="item.children.some(c => route().current(c.activePattern))" class="absolute inset-y-0 left-0 w-1 bg-gold-500 rounded-r-lg"></span>
                            <component :is="item.icon" class="w-6 h-6" :class="[item.children.some(c => route().current(c.activePattern)) ? 'text-gold-400' : 'text-gray-500']" />
                            <span class="ml-4 flex-1" v-show="sidebarOpen || mobileSidebarOpen">{{ item.name }}</span>
                            <ChevronDownIcon v-show="sidebarOpen || mobileSidebarOpen" class="w-5 h-5 transition-transform" :class="openSubMenu === item.key && 'rotate-180'" />
                        </button>
                        <div v-show="openSubMenu === item.key && (sidebarOpen || mobileSidebarOpen)" class="pl-10 pr-4 py-2 space-y-1 bg-gray-900/50">
                            <Link v-for="child in item.children" :key="child.name" :href="route(child.route)"
                                  :class="[
                                      'block w-full text-left p-2 rounded-md text-sm transition-colors duration-200',
                                      route().current(child.activePattern) ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-white'
                                  ]">
                                {{ child.name }}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Logout -->
            <div class="absolute bottom-0 w-full border-t border-gray-800">
                <button @click="logout" class="flex items-center w-full py-4 text-gray-400 hover:text-white transition-colors duration-200"
                        :class="sidebarOpen || mobileSidebarOpen ? 'px-6' : 'justify-center'">
                    <LogoutIcon class="w-6 h-6" />
                    <span class="ml-4" v-show="sidebarOpen || mobileSidebarOpen">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main -->
        <div class="flex flex-col flex-1 transition-all duration-300 ease-in-out" :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'">
            <header class="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-8 bg-gray-900/70 backdrop-blur-lg border-b border-gold-500/20">
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
                <div class="bg-gray-900/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl p-6">
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
