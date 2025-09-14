<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import LogoutIcon from '@/Components/Icons/LogoutIcon.vue';
import ChevronLeftIcon from '@/Components/Icons/ChevronLeftIcon.vue';
import ChevronDownIcon from '@/Components/Icons/ChevronDownIcon.vue';
import SidebarLink from '@/Layouts/Partials/SidebarLink.vue';
import {
    HomeIcon,
    DocumentPlusIcon,
    QueueListIcon,
    TicketIcon,
    NewspaperIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
    sidebarOpen: Boolean,
    mobileSidebarOpen: Boolean,
    menuItems: Array,
});

const emit = defineEmits(['toggle-sidebar']);

const openSubMenu = ref('');

const logout = () => {
    router.post(route('logout'));
};

const page = usePage();
const hasPendingApplication = computed(() => page.props.auth.hasPendingApplication);
const isAdmin = computed(() => page.props.auth.user?.is_admin);

const userMenu = computed(() => [
    { name: 'Dashboard', route: 'dashboard', icon: 'home' },
    { name: 'Anzisha Maombi', route: 'user.applications.selectCategory', icon: 'document-plus', disabled: hasPendingApplication.value },
    { name: 'Hali ya Maombi', route: 'user.applications.index', icon: 'queue-list', notification: hasPendingApplication.value },
    { name: 'Nunua Tiketi', route: 'tickets.index', icon: 'ticket' },
    { name: 'Wasifu Wangu', route: 'profile.edit', icon: 'user-circle' },
]);
</script>

<template>
    <aside :class="[
        'fixed inset-y-0 left-0 z-40 bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out',
        'lg:translate-x-0',
        sidebarOpen ? 'w-64' : 'w-20',
        mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full',
        $attrs.class // Hii ni kwa ajili ya AuthenticatedLayout
    ]">
        <!-- Logo -->
        <div class="flex items-center h-20 px-6 border-b border-gray-800" :class="sidebarOpen ? 'justify-between' : 'justify-center'">
            <Link :href="isAdmin ? route('admin.dashboard') : route('dashboard')" v-show="sidebarOpen || mobileSidebarOpen">
                <ApplicationLogo class="h-10" />
            </Link>
            <button v-if="isAdmin" @click="$emit('toggle-sidebar')" class="hidden lg:block p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500">
                <ChevronLeftIcon class="w-6 h-6 transition-transform duration-300" :class="!sidebarOpen && 'rotate-180'" />
            </button>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-4 flex-1 px-2 space-y-1">
            <!-- Admin Menu -->
            <template v-if="isAdmin">
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
                                  :class="['block w-full text-left p-2 rounded-md text-sm transition-colors duration-200', route().current(child.activePattern) ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-white']">
                                {{ child.name }}
                            </Link>
                        </div>
                    </div>
                </div>
            </template>
            <!-- Regular User Menu -->
            <template v-else>
                <!-- BORESHO: Ongeza menu ya Posts hapa pia, kama inahitajika kwa watumiaji wa kawaida -->
                <!-- <SidebarLink :href="route('posts.index')" :active="route().current('posts.index')" :item="{ name: 'Habari na Matukio', icon: 'newspaper' }" /> -->

                <SidebarLink v-for="item in userMenu" :key="item.name" :href="route(item.route)" :active="route().current(item.route)" :item="item" />
                <div class="py-2 px-2">
                    <div class="border-t border-gray-700"></div>
                </div>
              </template>
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
</template>