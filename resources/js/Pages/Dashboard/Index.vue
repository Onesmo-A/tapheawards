<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
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

defineOptions({ layout: AdminLayout });

const props = defineProps({
    stats: Object,
});

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

    <div class="min-h-screen">
        <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8 space-y-10">

            <!-- Welcome Header -->
            <div class="px-4 sm:px-0 border-b border-white/10 pb-6">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">Karibu, {{ user.name }}!</h1>
                <p class="mt-2 text-lg text-gray-300">Anza safari yako ya kuelekea usiku wa tuzo.</p>
            </div>


            <!-- Stats Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl">
                    <div class="flex items-center gap-4">
                        <div class="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                            <PresentationChartLineIcon class="h-6 w-6 text-emerald-300" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">Maombi Yaliyokubalika</p>
                            <p class="text-2xl font-bold text-white">
                                {{ (props.stats?.approved_applications ?? 0).toLocaleString('sw-TZ') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl">
                    <div class="flex items-center gap-4">
                        <div class="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                            <ExclamationTriangleIcon class="h-6 w-6 text-red-300" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">Maombi Yaliyoachwa</p>
                            <p class="text-2xl font-bold text-white">
                                {{ (props.stats?.rejected_applications ?? 0).toLocaleString('sw-TZ') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Pending Application Card -->
            <div
                v-if="pendingApplication"
                class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-sm backdrop-blur-xl"
            >
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.25),transparent_45%)]" aria-hidden="true"></div>

                <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <div class="mt-1 flex items-center justify-center h-11 w-11 rounded-xl ring-1 ring-white/10 bg-black/20">
                            <component :is="statusDetails.icon" class="h-6 w-6" />
                        </div>

                        <div class="flex-grow">
                            <div class="flex flex-wrap items-center gap-3">
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-white/10"
                                    :class="statusDetails.classes"
                                >
                                    {{ statusDetails.text }}
                                </span>

                                <p class="text-sm text-gray-300">
                                    Ombi la tuzo ya <span class="font-semibold text-white">{{ pendingApplication.category?.name || 'Haijulikani' }}</span>
                                </p>
                            </div>

                            <p class="mt-2 text-sm text-gray-400">
                                Lilitumwa {{ formatDate(pendingApplication.created_at) }}.
                            </p>
                        </div>
                    </div>

                    <div class="flex-shrink-0">
                        <Link
                            :href="route('user.applications.show', pendingApplication.id)"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 w-full sm:w-auto"
                        >
                            Angalia Maelezo & Malipo
                            <ArrowRightIcon class="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>


            <!-- Main Action Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">

                <!-- Start New Application -->
                <div class="bg-gradient-to-br from-fuchsia-800/70 via-rose-800/40 to-gray-900 text-white p-8 rounded-2xl border border-white/10 shadow-sm backdrop-blur-xl flex flex-col justify-between min-h-[220px] transform hover:-translate-y-0.5 transition-transform duration-300">
                    <div>
                        <DocumentPlusIcon class="h-12 w-12 mb-4 opacity-90" />
                        <h2 class="text-white text-2xl font-bold tracking-tight">Omba Form za Tuzo</h2>
                        <p class="mt-2 text-gray-300">Uko tayari kushiriki? Anza kwa kuchagua tuzo na ujaze fomu ya maombi.</p>
                    </div>
                    <div class="mt-6">
                        <Link :href="route('user.applications.selectCategory')" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors duration-300 w-full sm:w-auto">
                            Tuma Ombi Jipya
                            <ArrowRightIcon class="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                <!-- Buy Tickets -->
                <div class="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-sm backdrop-blur-xl flex flex-col justify-between min-h-[220px] transform hover:-translate-y-0.5 transition-transform duration-300">
                    <div>
                        <TicketIcon class="h-12 w-12 mb-4 text-red-300" />
                        <h2 class="text-2xl font-bold text-white tracking-tight">Nunua Tiketi</h2>
                        <p class="mt-2 text-gray-300">Usikose tukio la mwaka! Pata tiketi yako sasa na uwe sehemu ya historia.</p>
                    </div>
                    <div class="mt-6">
                        <button @click="$inertia.get(route('tickets.purchase'))" class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors duration-300 w-full sm:w-auto">
                            Nunua Tiketi Sasa
                            <ArrowRightIcon class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Static Info Section -->
            <div class="bg-white/5 p-8 rounded-2xl shadow-sm border border-white/10 mt-10 space-y-6">
                <h2 class="text-2xl font-bold text-white mb-2">Taarifa Muhimu</h2>
                <p class="text-sm text-gray-400">Tafadhali soma kabla ya kufanya malipo.</p>

                <ul class="space-y-3 text-gray-200 list-disc list-inside">
                    <li>Ujumbe wa kuthibitisha muamala utatumwa moja kwa moja kwenye simu yako mara tu unapowasilisha fomu.</li>
                    <li>Tafadhali hakikisha una salio la kutosha kwenye simu yako na kuwa nayo karibu wakati wa kufanya muamala.</li>
                    <li>Tembelea akaunti yako mara kwa mara ili kupata taarifa za uthibitisho.</li>
                    <li>
                        Kwa msaada zaidi, tafadhali wasiliana na Uongozi:
                        <strong class="text-white">+255 749 562 993</strong>
                        au
                        <a href="mailto:info@tapheawards.co.tz" class="text-red-300 hover:text-red-200 underline decoration-red-400/50 underline-offset-2">
                            info@tapheawards.co.tz
                        </a>
                    </li>
                </ul>
            </div>



        </div>
    </div>
</template>
