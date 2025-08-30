<script setup>
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import SidebarLink from '@/Layouts/Partials/SidebarLink.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    item: Object,
});

const page = usePage();

// Kagua kama link yoyote ndani ya submenu hii iko 'active'
const isActive = computed(() => {
       return props.item.children.some(child => {
        // Usijaribu kukagua link iliyozimwa au isiyo na route
        if (child.disabled || !child.route) {
            return false;
        }
        try {
            // Jaribu kutengeneza URL. Itashindwa kama vigezo vinavyohitajika havipo.
            const childUrl = route(child.route, child.params || {});
            return page.url.startsWith(childUrl.replace(/\?.*$/, ''));
        } catch (e) {
            return false; // Kama imeshindwa, sio link inayotumika na tunaepuka kosa.
        }
    });
});

const isOpen = ref(isActive.value);
</script>

<template>
    <div>
        <button @click="isOpen = !isOpen"
            class="w-full text-left flex items-center p-2 rounded-lg transition-colors duration-200"
            :class="[isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white']"
        >
            <!-- Icon component can be dynamic if needed -->
            <component v-if="item.icon" :is="item.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
            <span class="flex-1">{{ item.name }}</span>
            <ChevronDownIcon class="h-5 w-5 transition-transform duration-300" :class="{ 'rotate-180': isOpen }" />
        </button>

        <!-- Collapsible Submenu -->
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div v-show="isOpen" class="pl-4 mt-2 space-y-2">
                <template v-for="child in item.children" :key="child.name">
                    <SidebarLink
                        :href="child.route ? route(child.route, child.params || {}) : '#'"
                        :active="child.route ? route().current(child.route) : false"
                        :item="child"
                    />
                </template>
            </div>
        </transition>
    </div>
</template>