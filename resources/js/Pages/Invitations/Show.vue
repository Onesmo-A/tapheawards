<script setup>
import { Head, useForm, usePage } from '@inertiajs/vue3';
import {
    CalendarDays,
    MapPin,
    Clock,
    Sparkles,
    CircleCheck,
    CircleX,
} from 'lucide-vue-next';

import { computed } from 'vue';

const props = defineProps({
    invitation: Object,
});

// Prevent default layout (AuthenticatedLayout) from being applied
defineOptions({ layout: null });

const page = usePage();
const flash = computed(() => page.props.flash);

const form = useForm({
    status: '',
});

const submitRsvp = (status) => {
    form.status = status;
    form.post(route('invitation.rsvp', props.invitation.uuid), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head :title="`Invitation for ${invitation.guest_name}`" />

    <div
        class="min-h-screen bg-gray-900 text-white font-serif flex items-center justify-center p-4 sm:p-6 lg:p-8"
        style="background-image: url('/images/background-pattern.png'); background-size: cover;"
    >
        <div
            class="max-w-2xl w-full bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/30 overflow-hidden transform transition-all duration-500 hover:scale-105"
        >
            <header class="text-center p-6 sm:p-6 border-b-2 border-yellow-500/50">
                <p class="text-xs tracking-wider text-yellow-400 uppercase font-serif">
                    You are cordially invited to the
                </p>
                <h1
                    class="text-3xl sm:text-5xl font-bold text-white mt-2 font-sans tracking-tight"
                >
                    {{ invitation.event_name }}
                </h1>
                <p v-if="invitation.event_description" class="mt-3 text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                    {{ invitation.event_description }}
                </p>
            </header>

            <main class="p-6 sm:p-8 text-center">
                <div class="mb-6 sm:mb-8">
                    <p class="text-gray-300 text-lg">This special invitation is extended to:</p>
                    <h2
                        class="text-3xl sm:text-5xl font-semibold text-yellow-400 mt-2"
                    >
                        {{ invitation.guest_name }}
                    </h2>
                    <p
                        v-if="invitation.guest_title"
                        class="text-gray-400 text-md mt-1"
                    >
                        {{ invitation.guest_title }}
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left my-6 sm:my-8">
                    <div class="flex items-center gap-4">
                        <CalendarDays
                            class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0"
                        />
                        <div>
                            <h3 class="font-bold text-white">DATE</h3>
                            <p class="text-gray-300">{{ invitation.event_date }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <Clock
                            class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0"
                        />
                        <div>
                            <h3 class="font-bold text-white">TIME</h3>
                            <p class="text-gray-300">{{ invitation.event_time }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <MapPin
                            class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0"
                        />
                        <div>
                            <h3 class="font-bold text-white">LOCATION</h3>
                            <p class="text-gray-300">{{ invitation.event_venue }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <Sparkles
                            class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 flex-shrink-0"
                        />
                        <div>
                            <h3 class="font-bold text-white">DRESS CODE</h3>
                            <p class="text-gray-300">{{ invitation.dress_code }}</p>
                        </div>
                    </div>
                </div>

                <!-- =========== RSVP SECTION =========== -->
                <div class="mt-6 sm:mt-8">
                    <!-- If guest hasn’t responded -->
                    <div v-if="invitation.rsvp_status === 'pending'">
                        <p class="text-base sm:text-lg text-gray-200 mb-4">
                            Kindly confirm your attendance:
                        </p>
                        <div class="flex justify-center gap-4">
                            <button
                                @click="submitRsvp('attending')"
                                :disabled="form.processing"
                                class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 disabled:opacity-50"
                            >
                                <CircleCheck class="h-6 w-6" />
                                I will attend
                            </button>
                            <button
                                @click="submitRsvp('declined')"
                                :disabled="form.processing"
                                class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 disabled:opacity-50"
                            >
                                <CircleX class="h-6 w-6" />
                                I will not attend
                            </button>
                        </div>
                    </div>

                    <!-- Flash messages -->
                    <div
                        v-if="flash.success"
                        class="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300"
                    >
                        {{ flash.success }}
                    </div>
                    <div
                        v-if="flash.warning"
                        class="mt-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300"
                    >
                        {{ flash.warning }}
                    </div>

                    <!-- If guest already confirmed attending -->
                    <div
                        v-if="invitation.rsvp_status === 'attending' && !flash.success"
                        class="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-300"
                    >
                        You have already confirmed your attendance. Welcome!
                    </div>

                    <!-- If guest already declined -->
                    <div
                        v-if="invitation.rsvp_status === 'declined' && !flash.success"
                        class="mt-6 p-4 bg-gray-500/20 border border-gray-500 rounded-lg text-gray-300"
                    >
                        You have already declined the invitation.
                    </div>
                </div>

                <p class="text-gray-400 italic mt-6 sm:mt-8 text-sm">
                    Your presence will be a great honor.
                </p>
            </main>

            <footer class="text-center p-4 bg-black bg-opacity-30">
                <img
                    src="/images/taphe-logo-white.png"
                    alt="TAPHE Awards Logo"
                    class="h-12 mx-auto"
                />
            </footer>
        </div>
    </div>
</template>
