<script setup>
import { ref, watch } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import Sidebar from '@/Layouts/Partials/Sidebar.vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useToast } from 'vue-toastification';

const sidebarOpen = ref(false);
const page = usePage();
const toast = useToast();

// Funga sidebar kiotomatiki mtumiaji anapobofya link (kwa ajili ya mobile)
router.on('navigate', () => {
    sidebarOpen.value = false;
});

// Sikiliza mabadiliko kwenye flash messages na onyesha toast
watch(() => page.props.flash, (flash) => {
    if (flash.success) {
        toast.success(flash.success);
    }
    if (flash.error) {
        toast.error(flash.error);
    }
    if (flash.warning) {
        toast.warning(flash.warning);
    }
}, { deep: true });
</script>

<template>
    <div>
        <div class="min-h-screen bg-gray-900">
            <!-- Mobile sidebar overlay -->
            <div v-show="sidebarOpen" class="fixed inset-0 z-30 bg-black/50 md:hidden" @click="sidebarOpen = false" />

            <!-- Sidebar -->
            <Sidebar id="sidebar" :class="['fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0', { 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }]" />

            <!-- Main content -->
            <div class="flex-1 flex flex-col md:pl-64">
                <nav class="bg-gray-800 border-b border-gray-700">
                    <!-- Primary Navigation Menu -->
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <!-- Hamburger Menu Button (Mobile) -->
                                <button @click.stop="sidebarOpen = !sidebarOpen" class="p-1 mr-2 text-gray-400 rounded-md md:hidden hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="sidebar" :aria-expanded="sidebarOpen">
                                    <span class="sr-only">Open sidebar</span>
                                    <Bars3Icon class="h-6 w-6" />
                                </button>

                                <!-- Header Slot -->
                                <header v-if="$slots.header">
                                    <slot name="header" />
                                </header>
                            </div>

                            <!-- Settings Dropdown -->
                            <div class="hidden sm:flex sm:items-center sm:ms-6">
                                <Dropdown align="right" width="48">
                                    <template #trigger>
                                        <button type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-400 bg-gray-800 hover:text-gray-200 focus:outline-none transition ease-in-out duration-150">
                                            {{ $page.props.auth.user.name }}
                                            <svg class="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                        </button>
                                    </template>

                                    <template #content>
                                        <DropdownLink :href="route('profile.edit')"> Profile </DropdownLink>
                                        <DropdownLink :href="route('logout')" method="post" as="button">
                                            Log Out
                                        </DropdownLink>
                                    </template>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- Page Content -->
                <main class="flex-1">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>