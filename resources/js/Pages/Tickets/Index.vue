<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { TicketIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    title: String,
    description: String,
    ticketTypes: Array,
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(value);
};
</script>

<template>
    <Head :title="title" />

    <div class="bg-gray-100">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-40">
            <!-- Header Section -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    {{ title }}
                </h1>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                    {{ description }}
                </p>
            </div>

            <!-- Ticket Options -->
            <div v-if="ticketTypes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div
                    v-for="ticket in ticketTypes"
                    :key="ticket.id"
                    class="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col transform hover:scale-105 transition-transform duration-300"
                    :class="{ 'border-t-8 border-t-red-600': ticket.name.toLowerCase().includes('vip') }"
                >
                    <div class="p-8 flex-grow">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-2xl font-bold text-gray-900">{{ ticket.name }}</h2>
                            <TicketIcon class="h-8 w-8 text-red-500" />
                        </div>

                        <p class="text-4xl font-extrabold text-gray-900 mb-4">
                            {{ formatCurrency(ticket.price) }}
                        </p>

                        <p class="text-gray-600 min-h-[60px]">{{ ticket.description }}</p>

                        <!-- BORESHO: Onyesha sifa (features) kutoka kwenye database -->
                        <ul v-if="ticket.features && ticket.features.length" class="mt-6 space-y-2 text-gray-700">
                            <li v-for="(feature, index) in ticket.features" :key="index" class="flex items-center">
                                <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" />
                                <span>{{ feature }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="p-6 bg-gray-50 rounded-b-2xl mt-auto">
                        <Link
                            :href="route('tickets.purchase', { ticket_type_id: ticket.id })"
                            class="block w-full text-center bg-red-600 text-white font-semibold rounded-lg py-3 hover:bg-red-700 transition-colors duration-300"
                        >
                            Chagua Tiketi
                        </Link>
                    </div>
                </div>
            </div>

            <!-- No Tickets Available Message -->
            <div v-else class="text-center bg-white p-12 rounded-lg shadow-md">
                <TicketIcon class="mx-auto h-16 w-16 text-gray-400" />
                <h3 class="mt-4 text-xl font-medium text-gray-900">Tiketi Bado Hazijatolewa</h3>
                <p class="mt-2 text-gray-500">
                    Samahani, kwa sasa hakuna tiketi zinazopatikana. Tafadhali rudi tena karibuni.
                </p>
            </div>
        </div>
    </div>
</template>
