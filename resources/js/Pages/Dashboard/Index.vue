<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import ApplicationStatusCard from '@/Components/ApplicationStatusCard.vue';
import { Head, usePage, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { InboxIcon } from '@heroicons/vue/24/outline';

// Pata taarifa za mtumiaji kutoka kwenye props zilizoshirikiwa na Inertia (njia sahihi)
const user = computed(() => usePage().props.auth.user);

defineProps({
    applications: Array,
});
</script>

<template>
  <Head title="Dashboard" />

  <AuthenticatedLayout>
    <template #header>
        <h2 class="font-semibold text-xl text-gray-200 leading-tight">
            Dashboard
        </h2>
    </template>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                <!-- Main Content: User Details -->
                <div class="lg:col-span-2 bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-white">
                    <h1 class="text-3xl font-bold mb-2 text-gold-400">
                        Karibu, {{ user?.name.split(' ')[0] || 'Mtumiaji' }}!
                    </h1>
                    <p class="text-gray-400 mb-6">
                        Hii ni dashboard yako ya watumiaji. Hapa unaweza kuona maelezo yako na kuanzisha maombi ya tuzo.
                    </p>
                    <div class="border-t border-gray-700 pt-6">
                        <h2 class="text-xl font-semibold mb-4 text-gray-200">Maelezo ya Akaunti</h2>
                        <ul class="space-y-3 text-gray-300">
                            <li class="flex items-center"><strong class="w-28 flex-shrink-0">Jina Kamili:</strong> <span>{{ user?.name }}</span></li>
                            <li class="flex items-center"><strong class="w-28 flex-shrink-0">Email:</strong> <span>{{ user?.email }}</span></li>
                            <li class="flex items-center"><strong class="w-28 flex-shrink-0">ID ya Mtumiaji:</strong> <span>{{ user?.id }}</span></li>
                        </ul>
                    </div>
                </div>

                <!-- Sidebar-like Action Card -->
                <div class="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col justify-center">
                    <h2 class="text-xl font-semibold mb-4 text-gray-200">Maombi ya Tuzo</h2>
                    <p class="text-gray-400 mb-6">Uko tayari kushiriki? Anzisha mchakato wa maombi yako sasa.</p>
                    <Link :href="route('user.applications.create')">
                        <PrimaryButton class="w-full justify-center">Anzisha Maombi Mapya</PrimaryButton>
                    </Link>
                </div>

            </div>

            <!-- Recent Applications Section -->
            <div class="bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg text-white">
                <h2 class="text-xl font-semibold mb-6 text-gray-200">Maombi Yako ya Hivi Karibuni</h2>

                <div v-if="applications && applications.length > 0" class="space-y-4">
                    <ApplicationStatusCard
                        v-for="app in applications"
                        :key="app.id"
                        :application="app"
                    />
                </div>

                <div v-else class="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                    <InboxIcon class="mx-auto h-12 w-12 text-gray-500" />
                    <h3 class="mt-2 text-sm font-semibold text-gray-300">Hakuna maombi</h3>
                    <p class="mt-1 text-sm text-gray-500">Bado hujawasilisha maombi yoyote. Anza sasa!</p>
                    <div class="mt-6">
                        <Link :href="route('user.applications.create')">
                            <PrimaryButton>Anzisha Maombi Mapya</PrimaryButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </AuthenticatedLayout>
</template>
