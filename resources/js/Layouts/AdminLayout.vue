<script setup>
import { h, ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { router, Link, usePage } from '@inertiajs/vue3';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import FlashMessage from '@/Components/FlashMessage.vue';

// Import Icons
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Sidebar from '@/Layouts/Partials/Sidebar.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import LogoutIcon from '@/Components/Icons/LogoutIcon.vue';
import MenuIcon from '@/Components/Icons/MenuIcon.vue';
import CloseIcon from '@/Components/Icons/CloseIcon.vue';

// Heroicons
import {
    HomeIcon as DashboardIcon,
    FolderIcon as CategoryIcon,
    UserGroupIcon,
    ChartBarIcon as VoteIcon,
    TrophyIcon,
    DocumentTextIcon,
    CurrencyDollarIcon as TransactionIcon,
    Cog6ToothIcon as CogIcon, // BORESHO: Ongeza TicketIcon
    LightBulbIcon as SuggestionIcon,
    NewspaperIcon,
    TicketIcon,
    UserCircleIcon,
    AdjustmentsHorizontalIcon,
    DocumentPlusIcon,
    QueueListIcon, 
    PhotoIcon,
    VideoCameraIcon,
} from '@heroicons/vue/24/outline';

const page = usePage();
const user = computed(() => page.props.auth.user);
const userInitial = computed(() => (user.value && user.value.name) ? user.value.name.charAt(0).toUpperCase() : '');
const hasPendingApplication = computed(() => page.props.auth.hasPendingApplication);

const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);

const menuItems = [
    { name: 'Dashboard', route: 'admin.dashboard', icon: DashboardIcon, children: [], activePattern: 'admin.dashboard' },
    {
        name: 'Content',
        icon: NewspaperIcon,
        key: 'content',
        children: [
            { name: 'Categories', route: 'admin.categories.index', icon: CategoryIcon, activePattern: 'admin.categories.*' },
            { name: 'Nominees', route: 'admin.nominees.index', icon: UserGroupIcon, activePattern: 'admin.nominees.*' },
            { name: 'Gallery Albums', route: 'admin.gallery-albums.index', icon: PhotoIcon, activePattern: 'admin.gallery-albums.*' },
            { name: 'Posts', route: 'admin.posts.index', icon: NewspaperIcon, activePattern: 'admin.posts.*' },
            { name: 'Reels', route: 'admin.reels.index', icon: VideoCameraIcon, activePattern: 'admin.reels.*' },
        ]
    },
    {
        name: 'User Activity',
        icon: DocumentTextIcon,
        key: 'interactions',
        children: [
            { name: 'Applications', route: 'admin.applications.index', icon: DocumentTextIcon, activePattern: 'admin.applications.*' },
            { name: 'Transactions', route: 'admin.transactions.index', icon: TransactionIcon, activePattern: 'admin.transactions.*' },
            { name: 'Suggestions', route: 'admin.suggestions.index', icon: SuggestionIcon, activePattern: 'admin.suggestions.*' },
            { name: 'Users', route: 'admin.users.index', icon: UserGroupIcon, activePattern: 'admin.users.*' },
        ]
    },
    {
        name: 'Marathon',
        route: 'admin.marathon.index',
        icon: TicketIcon,
        children: [],
        activePattern: 'admin.marathon.*'
    },
    {
        name: 'Tickets',
        icon: TicketIcon,
        key: 'tickets',
        children: [
            { name: 'Ticket Types', route: 'admin.ticket-types.index', icon: AdjustmentsHorizontalIcon, activePattern: 'admin.ticket-types.*' },
            { name: 'Dashboard', route: 'admin.tickets.dashboard', icon: DashboardIcon, activePattern: 'admin.tickets.dashboard' },
            { name: 'Create Tickets', route: 'admin.tickets.create', icon: DocumentPlusIcon, activePattern: 'admin.tickets.create' },
            { name: 'Scan Ticket', route: 'admin.tickets.scan', icon: h(TicketIcon, { class: 'transform rotate-90' }), activePattern: 'admin.tickets.scan' },
        ],
        // BORESHO: Badilisha jina la menyu kuu na panga upya linki za ndani
        // 'Aina za Tiketi' sasa ni ya kwanza, ikifuatiwa na 'Dashboard' na 'Scan'
    },
    {
        name: 'Voting',
        icon: VoteIcon,
        key: 'voting',
        children: [
            { name: 'Vote List', route: 'admin.votes.index', icon: VoteIcon, activePattern: 'admin.votes.*' },
            { name: 'Winners', route: 'admin.winners.index', icon: TrophyIcon, activePattern: 'admin.winners.*' },
        ]
    },
    {
        name: 'Settings',
        route: 'admin.settings.index',
        icon: CogIcon,
        children: [],
        activePattern: 'admin.settings.*'
    },
];

const userMenu = computed(() => [
    { name: 'Dashboard', route: 'dashboard', icon: DashboardIcon },
    { name: 'Anzisha Maombi', route: 'user.applications.selectCategory', icon: DocumentPlusIcon, disabled: hasPendingApplication.value },
    { name: 'Hali ya Maombi', route: 'user.applications.index', icon: QueueListIcon, notification: hasPendingApplication.value },
    { name: 'Nunua Tiketi', route: 'tickets.index', icon: TicketIcon },
    { name: 'Wasifu Wangu', route: 'profile.edit', icon: UserCircleIcon },
]);

watch(mobileSidebarOpen, (value) => {
    if (value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

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

</script>

<template>
    <div class="min-h-screen bg-gray-900">
        <FlashMessage />
        <!-- Sidebar -->
        <Sidebar 
            :sidebarOpen="user.is_admin ? sidebarOpen : true" 
            :mobileSidebarOpen="mobileSidebarOpen" 
            :menuItems="menuItems" 
            :userMenu="userMenu" 
            @toggle-sidebar="sidebarOpen = !sidebarOpen"
            @close-mobile-sidebar="mobileSidebarOpen = false"
        />

        <!-- Main Content -->
        <div class="flex flex-col flex-1 transition-all duration-300 ease-in-out" :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'">
            <!-- Top Navigation -->
            <header class="sticky top-0 z-20 flex items-center justify-between h-20 px-4 sm:px-8 bg-gray-900/70 backdrop-blur-lg border-b border-gold-500/20">
                <!-- Mobile Menu Button -->
                <button 
                    type="button" 
                    class="-m-2.5 p-2.5 text-gray-400 lg:hidden" 
                    @click="mobileSidebarOpen = true"
                >
                    <span class="sr-only">Open sidebar</span>
                    <MenuIcon v-if="!mobileSidebarOpen" class="h-6 w-6" />
                    <CloseIcon v-else class="h-6 w-6" />
                </button>

                <div class="hidden lg:block">
                    <!-- Optional search bar -->
                </div>

                <div v-if="user" class="flex items-center ml-auto">
                    <!-- User Menu -->
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <button class="flex items-center space-x-3 focus:outline-none">
                                <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gold-500 text-gray-900 font-bold text-lg">
                                    {{ userInitial }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <div class="font-bold text-sm text-gray-200">{{ user.name }}</div>
                                    <div class="text-xs text-gray-400">{{ user.is_admin ? 'Admin' : 'User' }}</div>
                                </div>
                            </button>
                        </template>
                        <template #content>
                            <div class="px-4 py-3 border-b border-gray-600">
                                <p class="text-sm font-semibold text-white">{{ user.name }}</p>
                                <p class="text-sm text-gray-400 truncate">{{ user.email }}</p>
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

            <!-- Main Content Area -->
            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                <div v-if="$slots.header" class="mb-6">
                    <slot name="header" />
                </div>
                <!-- REKEBISHO: Ondoa kontena la nje ili kuruhusu kurasa za ndani zijipangilie zenyewe -->
                <slot />
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
