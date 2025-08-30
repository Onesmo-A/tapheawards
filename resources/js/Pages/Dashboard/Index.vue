<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import {
    ArrowRightIcon,
    TicketIcon,
    DocumentPlusIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    UsersIcon,
    PresentationChartLineIcon
} from '@heroicons/vue/24/outline';

defineOptions({ layout: AuthenticatedLayout });

const page = usePage();
const user = computed(() => page.props.auth.user);
const pendingApplication = computed(() => page.props.auth.pendingApplication);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('sw-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const statusDetails = computed(() => {
    if (!pendingApplication.value?.status) return {};
    const status = pendingApplication.value.status;
    const details = {
        pending_payment: { text: 'Inasubiri Malipo', icon: ClockIcon, classes: 'bg-yellow-100 text-yellow-800 border-yellow-400' },
        payment_failed: { text: 'Malipo Yameshindikana', icon: ExclamationTriangleIcon, classes: 'bg-red-100 text-red-800 border-red-400' },
        pending_review: { text: 'Inasubiri Uhakiki', icon: ClockIcon, classes: 'bg-blue-100 text-blue-800 border-blue-400' },
        approved: { text: 'Limekubaliwa', icon: CheckCircleIcon, classes: 'bg-green-100 text-green-800 border-green-400' },
    };
    return details[status] || { text: status.replace(/_/g, ' '), icon: ClockIcon, classes: 'bg-gray-100 text-gray-800 border-gray-400' };
});
</script>

<template>
    <Head title="Dashboard" />

    <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8 space-y-10">

            <!-- Welcome Header -->
            <div class="px-4 sm:px-0 border-b border-gray-200 pb-5">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Karibu, {{ user.name }}!</h1>
                <p class="mt-2 text-lg text-gray-600">Hapa ndipo pa kuanzia safari yako ya tuzo.</p>
            </div>

            <!-- Stats Section (Static & Professional) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-0">
                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <div class="flex items-center gap-4">
                        <UsersIcon class="h-10 w-10 text-blue-500"/>
                        <div>
                            <p class="text-gray-500 text-sm">Jumla ya Washiriki</p>
                            <p class="text-2xl font-bold text-gray-900">200+</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <div class="flex items-center gap-4">
                        <PresentationChartLineIcon class="h-10 w-10 text-green-500"/>
                        <div>
                            <p class="text-gray-500 text-sm">Maombi Yaliyokubalika</p>
                            <p class="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                    <div class="flex items-center gap-4">
                        <ExclamationTriangleIcon class="h-10 w-10 text-red-500"/>
                        <div>
                            <p class="text-gray-500 text-sm">Maombi Yaliyoachwa</p>
                            <p class="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Application Card -->
            <div v-if="pendingApplication" :class="statusDetails.classes" class="border-l-4 rounded-r-lg p-4 sm:p-6 shadow-md">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <component :is="statusDetails.icon" class="h-10 w-10 flex-shrink-0" />
                        <div class="flex-grow">
                            <p class="font-bold text-lg">{{ statusDetails.text }}</p>
                            <p class="text-sm">Ombi la tuzo ya <strong>{{ pendingApplication.category?.name || 'Haijulikani' }}</strong> lilitumwa {{ formatDate(pendingApplication.created_at) }}.</p>
                        </div>
                    </div>
                    <div class="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                        <Link :href="route('user.applications.show', pendingApplication.id)" class="btn-primary inline-flex items-center text-sm !py-2 !px-4 w-full sm:w-auto justify-center">
                            Angalia Maelezo & Malipo
                            <ArrowRightIcon class="ml-2 -mr-1 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Main Action Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">

                <!-- Start New Application -->
                <div class="bg-gradient-to-br from-pink-800 to-gray-900 text-white p-8 rounded-xl shadow-2xl flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                    <div>
                        <DocumentPlusIcon class="h-12 w-12 mb-4 opacity-80" />
                        <h2 class="text-white text-2xl font-bold tracking-tight">Omba Form za Tuzo</h2>
                        <p class="mt-2 text-gray-400">Uko tayari kushiriki? Anza kwa kuchagua tuzo na ujaze fomu ya maombi.</p>
                    </div>
                    <div class="mt-6">
                        <Link :href="route('user.applications.selectCategory')" class="inline-flex items-center bg-white text-gray-800 font-semibold rounded-lg text-sm px-6 py-3 text-center hover:bg-gray-200 transition-colors duration-300">
                            Tuma Ombi Jipya
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <!-- Buy Tickets -->
                <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-lg flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                    <div>
                        <TicketIcon class="h-12 w-12 mb-4 text-red-500" />
                        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Nunua Tiketi</h2>
                        <p class="mt-2 text-gray-600">Usikose tukio la mwaka! Pata tiketi yako sasa na uwe sehemu ya historia.</p>
                    </div>
                     <div class="mt-6">
                        <button @click="$inertia.get(route('tickets.purchase'))" class="inline-flex items-center bg-red-600 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center hover:bg-red-700 transition-colors duration-300">
                            Nunua Tiketi Sasa
                            <ArrowRightIcon class="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Static Info Section (Professional & Modern) -->
            <div class="bg-white p-8 rounded-xl shadow-xl mt-10 space-y-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Taarifa Muhimu</h2>
                <ul class="space-y-3 text-gray-700 list-disc list-inside">
                    <li>Hakikisha unakamilisha maombi yako kwa wakati.</li>
                    <li>Angalia email yako mara kwa mara kwa taarifa za uthibitisho.</li>
                    <li>Maombi ya Tiketi ni kwa msingi wa kwanza kuja, kwanza kuhudhuria.</li>
                    <li>Kwa msaada zaidi, wasiliana na timu yetu kupitia <strong>support@tapheawards.co.tz</strong>.</li>
                </ul>
            </div>

        </div>
    </div>
</template>
