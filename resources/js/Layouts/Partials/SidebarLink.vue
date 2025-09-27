<script setup>
import { ref, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { BeakerIcon, HomeIcon, FolderIcon, UserGroupIcon, ChartBarIcon, InboxIcon, TrophyIcon, Cog6ToothIcon, DocumentTextIcon, ChevronDownIcon, DocumentPlusIcon, TicketIcon, UserCircleIcon, QueueListIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    href: String,
    active: Boolean,
    item: Object,
    sidebarOpen: { type: Boolean, default: true },
    isSubmenu: { type: Boolean, default: false }, // Ongeza prop hii
});

const components = {
    'home': HomeIcon,
    'folder': FolderIcon,
    'user-group': UserGroupIcon,
    'chart-bar': ChartBarIcon,
    'inbox': InboxIcon,
    'trophy': TrophyIcon,
    'cog-6-tooth': Cog6ToothIcon,
    'document-text': DocumentTextIcon,
    'document-plus': DocumentPlusIcon,
    'ticket': TicketIcon,
    'user-circle': UserCircleIcon,
    'queue-list': QueueListIcon,
    'beaker': BeakerIcon,
};

const isSubmenuOpen = ref(props.active);

const hasChildren = computed(() => props.item.children && props.item.children.length > 0);

const isSubmenuActive = computed(() => {
    if (!hasChildren.value) return false;
    return props.item.children.some(child => route().current(child.route + '*'));
});

const toggleSubmenu = () => {
    if (hasChildren.value) {
        isSubmenuOpen.value = !isSubmenuOpen.value;
    }
};
</script>

<template>
    <div>
        <!-- REKEBISHO: Rahisisha component, ondoa mantiki ya kujirudia. Sasa inashughulikia linki moja tu. -->
        <Link
            :href="href"
            class="w-full text-left flex items-center rounded-lg transition-colors duration-200"
            :class="[
                isSubmenu ? 'py-2 px-2 text-sm' : 'py-3 px-4',
                !sidebarOpen && !isSubmenu ? 'px-2 justify-center' : '',
                active ? (isSubmenu ? 'text-gold-400 font-semibold' : 'text-white bg-gray-800') : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :disabled="item.disabled"
            :title="item.disabled ? 'Tayari una ombi linaloendelea' : (!sidebarOpen ? item.name : '')"
        >
            <component :is="item.icon" class="h-6 w-6 flex-shrink-0" :class="[active ? 'text-gold-400' : 'text-gray-500', sidebarOpen ? 'w-6' : 'w-7']" />
            <span class="ml-4 flex-1" v-show="sidebarOpen">{{ item.name }}</span>
            <span v-if="item.notification" class="ml-auto w-2 h-2 rounded-full bg-gold-500" v-show="sidebarOpen"></span>
        </Link>
    </div>
</template>