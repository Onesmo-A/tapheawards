<script setup>
import { Link, router, usePage } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import LogoutIcon from '@/Components/Icons/LogoutIcon.vue';
import ChevronLeftIcon from '@/Components/Icons/ChevronLeftIcon.vue';
import ChevronDownIcon from '@/Components/Icons/ChevronDownIcon.vue';
import SidebarLink from '@/Layouts/Partials/SidebarLink.vue';
import { // BORESHO: Ongeza UserGroupIcon
    HomeIcon, DocumentPlusIcon, QueueListIcon, TicketIcon, UserCircleIcon, NewspaperIcon, WrenchScrewdriverIcon // Icons za User
} from '@heroicons/vue/24/outline'; // BORESHO: Ongeza icon ya marathon
import { ShieldCheckIcon } from '@heroicons/vue/24/solid';
const props = defineProps({
    sidebarOpen: Boolean,
    mobileSidebarOpen: Boolean,
    menuItems: { type: Array, default: () => [] },
    userMenu: { type: Array, default: () => [] }, // Ongeza hii
});
const page = usePage();

const emit = defineEmits(['toggle-sidebar']);


// Find the key of the currently active submenu
const findActiveSubMenuKey = () => {
    const activeItem = props.menuItems.find(item =>
        item.children && item.children.some(child => route().current(child.activePattern))
    );
    return activeItem ? activeItem.key : '';
};

const openSubMenu = ref(findActiveSubMenuKey());

// Watch for route changes to update the active submenu
watch(() => page.url, () => openSubMenu.value = findActiveSubMenuKey());

const logout = () => {
    router.post(route('logout'));
};

const isAdmin = computed(() => page.props.auth.user?.is_admin);

const isSubmenuActive = (item) => {
    return item.children && item.children.some(child => route().current(child.activePattern));
};
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
            <Link :href="isAdmin ? route('admin.dashboard') : route('dashboard')" v-show="sidebarOpen || mobileSidebarOpen" class="transition-opacity duration-300">
                <ApplicationLogo class="h-10" />
            </Link>
            <button v-if="isAdmin" @click="$emit('toggle-sidebar')" class="hidden lg:block p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500">
                <ChevronLeftIcon class="w-6 h-6 transition-transform duration-300" :class="!sidebarOpen && 'rotate-180'" />
            </button>
        </div>

        <!-- Navigation Links with Scrollbar -->
        <div class="h-[calc(100vh-128px)] overflow-y-auto sidebar-scroll">
            <nav class="mt-4 flex-1 px-2 space-y-1">
                <!-- Admin Menu -->
                <template v-if="isAdmin">
                    <div v-for="item in menuItems" :key="item.name">
                        <component :is="item.children.length ? 'button' : Link"
                                   :href="item.children.length ? null : route(item.route)"
                                   @click="item.children.length ? (openSubMenu = (openSubMenu === item.key ? '' : item.key)) : null"
                                   :class="[
                                       'w-full flex items-center py-3 rounded-lg transition-colors duration-200 relative',
                                       sidebarOpen || mobileSidebarOpen ? 'px-4' : 'px-2 justify-center',
                                       (route().current(item.route) || isSubmenuActive(item)) ? 'text-white bg-gray-800' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                ]"
                                   :title="!(sidebarOpen || mobileSidebarOpen) ? item.name : ''">
                            <span v-if="route().current(item.route) || isSubmenuActive(item)" class="absolute inset-y-0 left-0 w-1 bg-gold-500 rounded-r-lg"></span>
                            <component :is="item.icon" class="h-6 w-6 flex-shrink-0" :class="[(route().current(item.route) || isSubmenuActive(item)) ? 'text-gold-400' : 'text-gray-500', sidebarOpen || mobileSidebarOpen ? 'w-6' : 'w-7']" />
                            <span class="ml-4 flex-1 text-left" v-show="sidebarOpen || mobileSidebarOpen">{{ item.name }}</span>
                            <ChevronDownIcon v-if="item.children.length" v-show="sidebarOpen || mobileSidebarOpen" class="w-5 h-5 transition-transform" :class="openSubMenu === item.key && 'rotate-180'" />
                        </component>

                        <div v-if="item.children.length" v-show="openSubMenu === item.key && (sidebarOpen || mobileSidebarOpen)" class="pl-8 pr-2 py-2 space-y-1 bg-gray-900/50 rounded-b-lg transition-all duration-300">
                            <!-- REKEBISHO: Ondoa mantiki ya kujirudia kutoka SidebarLink na weka hapa moja kwa moja -->
                            <SidebarLink v-for="child in item.children" :key="child.name"
                                         :href="child.route ? route(child.route) : '#'"
                                         :active="route().current(child.activePattern)"
                                         :item="child"
                                         :is-submenu="true"
                                         :sidebar-open="sidebarOpen || mobileSidebarOpen"
                            />
                        </div>
                    </div>
                </template>
                <!-- Regular User Menu -->
                <template v-else>
                    
                    <SidebarLink v-for="item in userMenu"
                                 :key="item.name"
                                 :href="item.route ? route(item.route) : '#'"
                                 :active="item.route ? route().current(item.route) : false"
                                 :item="item"
                    />
                    <div class="py-2 px-2">
                        <div class="border-t border-gray-700"></div>
                    </div>
                </template>
            </nav>
        </div>

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

<style scoped>
.sidebar-scroll::-webkit-scrollbar {
    width: 6px;
}
.sidebar-scroll::-webkit-scrollbar-track {
    background: #1f2937; /* bg-gray-800 */
}
.sidebar-scroll::-webkit-scrollbar-thumb {
    background-color: #4b5563; /* bg-gray-600 */
    border-radius: 20px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #d97706; /* text-amber-500 */
}
</style>

<style scoped>
.sidebar-scroll::-webkit-scrollbar {
    width: 6px;
}
.sidebar-scroll::-webkit-scrollbar-track {
    background: #1f2937; /* bg-gray-800 */
}
.sidebar-scroll::-webkit-scrollbar-thumb {
    background-color: #4b5563; /* bg-gray-600 */
    border-radius: 20px;
}
.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #d97706; /* text-amber-500 */
}
</style>