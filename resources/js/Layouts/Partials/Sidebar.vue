<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import SidebarLink from '@/Layouts/Partials/SidebarLink.vue';
import SidebarCollapsibleLink from '@/Layouts/Partials/SidebarCollapsibleLink.vue';
import {
    ArrowLeftOnRectangleIcon,
    HomeIcon,
    DocumentPlusIcon,
    QueueListIcon,
    TicketIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon,
    DocumentTextIcon,
} from '@heroicons/vue/24/outline';

const page = usePage();
const hasPendingApplication = computed(() => page.props.auth.hasPendingApplication);
const isAdmin = computed(() => page.props.auth.user?.is_admin);

const menu = computed(() => {
    const userMenu = [
        { name: 'Dashboard', route: 'dashboard', icon: HomeIcon },
        // Tumeviondoa vitufe kutoka kwenye collapsible menu na kuviweka moja kwa moja
        { name: 'Anzisha Maombi', route: 'user.applications.selectCategory', icon: DocumentPlusIcon, disabled: hasPendingApplication.value },
        { name: 'Hali ya Maombi', route: 'user.applications.index', icon: QueueListIcon, notification: hasPendingApplication.value },
        { name: 'Buy Tickets', route: 'dashboard', icon: TicketIcon },
        { name: 'My Profile', route: 'profile.edit', icon: UserCircleIcon },
    ];

    if (isAdmin.value) {
        userMenu.push({ isSeparator: true });
        userMenu.push({ name: 'Utawala (Admin)', route: 'admin.dashboard', icon: WrenchScrewdriverIcon });
    }

    return userMenu;
});
</script>

<template>
    <aside class="w-64 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-center px-4 border-b border-gray-700">
            <Link :href="route('dashboard')">
                <ApplicationLogo class="block h-10 w-auto fill-current text-gold-400" />
            </Link>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-2 py-4 space-y-2">
            <template v-for="(item, index) in menu" :key="item.name || `sep-${index}`">
                <!-- Separator for Admin section -->
                <div v-if="item.isSeparator" class="py-2 px-2">
                    <div class="border-t border-gray-700"></div>
                </div>
                <!-- Collapsible Link -->
                <SidebarCollapsibleLink v-else-if="item.children" :item="item" />
                <!-- Normal Link -->
                <SidebarLink
                    v-else
                    :href="item.route ? route(item.route, item.params || {}) : '#'"
                    :active="item.route ? route().current(item.route) : false"
                    :item="item"
                />
            </template>
        </nav>

        <!-- Logout Button -->
        <div class="px-2 py-3 mt-auto border-t border-gray-700">
            <Link
                :href="route('logout')"
                method="post"
                as="button"
                class="w-full text-left flex items-center p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-red-500/20 hover:text-red-300"
            >
                <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-3 flex-shrink-0" />
                <span class="flex-1">Toka (Log Out)</span>
            </Link>
        </div>
    </aside>
</template>