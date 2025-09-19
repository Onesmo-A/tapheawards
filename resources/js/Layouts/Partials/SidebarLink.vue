<script setup>
import { ref, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { BeakerIcon, HomeIcon, FolderIcon, UserGroupIcon, ChartBarIcon, InboxIcon, TrophyIcon, Cog6ToothIcon, DocumentTextIcon, ChevronDownIcon, DocumentPlusIcon, TicketIcon, UserCircleIcon, QueueListIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    href: String,
    active: Boolean,
    item: Object,
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
        <component
            :is="hasChildren ? 'button' : (href === '#' ? 'button' : Link)"
            :href="href !== '#' ? href : null"
            @click="toggleSubmenu" class="w-full text-left flex items-center rounded-lg transition-colors duration-200"
            :class="[
                isSubmenu && href
                    ? 'p-2 text-sm' // Classes za submenu
                    : 'p-2', // Classes za menu kuu (kama inatumika)
                active || isSubmenuActive
                    ? (isSubmenu ? 'text-gold-400 font-semibold' : 'bg-gold-500/10 text-gold-300')
                    : 'text-gray-400 hover:text-white',
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :disabled="item.disabled"
            :title="item.disabled ? 'Tayari una ombi linaloendelea' : ''"
        >
            <!-- REKEBISHO: Tumia 'item.icon' moja kwa moja kwa sababu ni component iliyopitishwa -->
            <component :is="item.icon" class="h-5 w-5 mr-3 flex-shrink-0 text-gray-500" :class="{'text-gold-400': active || isSubmenuActive}" />
            <span class="flex-1">{{ item.name }}</span>
            <ChevronDownIcon v-if="hasChildren" class="h-5 w-5 transition-transform duration-300" :class="{ 'rotate-180': isSubmenuOpen }" />
        </component>

        <div v-if="hasChildren && isSubmenuOpen" class="mt-2 pl-6 space-y-2">
            <SidebarLink
                v-for="child in item.children"
                :key="child.name"
                :href="route(child.route)"
                :active="route().current(child.route + '*')"
                :item="child"
            />
        </div>
    </div>
</template>