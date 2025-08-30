<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

defineOptions({ layout: AuthenticatedLayout });

const props = defineProps({
    applications: Object, // BORESHO: Data ya Paginator ni Object, sio Array
    title: String,
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('sw-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
const statusDetails = (status) => {
    const details = {
        pending_payment: { text: 'Inasubiri Malipo', class: 'bg-yellow-100 text-yellow-800' },
        payment_failed: { text: 'Malipo Yameshindikana', class: 'bg-red-100 text-red-800' },
        pending_review: { text: 'Inasubiri Uhakiki', class: 'bg-blue-100 text-blue-800' },
        approved: { text: 'Limekubaliwa', class: 'bg-green-100 text-green-800' },
        rejected: { text: 'Limekataliwa', class: 'bg-gray-200 text-gray-800' },
    };
    // BORESHO: Kagua kama `status` ipo kabla ya kutumia `replace`
    // Hii inazuia kosa kama `application.status` ni `undefined` au `null`.
    if (!status) {
        return { text: 'Hali Haijulikani', class: 'bg-gray-100 text-gray-800' };
    }
    return details[status] || { text: status.replace(/_/g, ' '), class: 'bg-gray-100 text-gray-800' };
};
</script>

<template>
    <Head>
        <title>{{ title }}</title>
    </Head>

    <div class="py-8 md:py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900">Maombi Yangu</h1>
                    <p class="mt-2 text-sm text-gray-600">Tazama historia na hali ya maombi yako yote ya tuzo.</p>
                </div>
                <div class="mt-4 md:mt-0">
                    <Link
                        :href="route('user.applications.selectCategory')" 
                        class="btn-primary inline-flex items-center justify-center text-sm !py-2 !px-4"
                    >
                        + Tuma Ombi Jipya
                    </Link>
                </div>
            </div>

            <!-- Applications List --> 
            <div class="bg-white shadow-md rounded-lg overflow-hidden"> 
                <!-- Desktop Table -->
                <div class="overflow-x-auto hidden md:block">
                    <table class="min-w-full divide-y divide-gray-200"> 
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuzo</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarehe</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiasi</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hali</th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200"> 
                            <tr v-if="!applications.data || applications.data.length === 0">
                                <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
                                    Haujatuma ombi lolote bado.
                                </td>
                            </tr>
                            <tr v-for="application in applications.data" :key="application.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ application.category?.name || 'Kategoria Imefutwa' }}</div>
                                    <div class="text-sm text-gray-500">{{ application.applicant_name }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(application.created_at) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ application.transaction?.amount ? `TZS ${new Intl.NumberFormat().format(application.transaction.amount)}` : 'Hakuna Malipo' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                        :class="statusDetails(application.status).class"
                                    >
                                        {{ statusDetails(application.status).text }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link :href="route('user.applications.show', application.id)" class="btn-secondary text-sm text-blue-600 hover:text-blue-900">
                                        Risiti
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden">
                    <div v-if="!applications.data || applications.data.length === 0" class="px-6 py-12 text-center text-sm text-gray-500">
                        Haujatuma ombi lolote bado.
                    </div>
                    <div v-else class="divide-y divide-gray-200">
                        <div v-for="application in applications.data" :key="application.id" class="p-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-bold text-gray-900">{{ application.category?.name || 'Kategoria Imefutwa' }}</p>
                                    <p class="text-xs text-gray-600">{{ application.applicant_name }}</p>
                                </div>
                                <span
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    :class="statusDetails(application.status).class"
                                >
                                    {{ statusDetails(application.status).text }}
                                </span>
                            </div>
                            <div class="mt-3 text-sm text-gray-600 space-y-1">
                                <p><span class="font-medium text-gray-800">Tarehe:</span> {{ formatDate(application.created_at) }}</p>
                                <p><span class="font-medium text-gray-800">Kiasi:</span> {{ application.transaction?.amount ? `TZS ${new Intl.NumberFormat().format(application.transaction.amount)}` : 'Hakuna Malipo' }}</p>
                            </div>
                            <div class="mt-3 text-right">
                                <Link :href="route('user.applications.show', application.id)" class="btn-secondary text-sm font-medium text-blue-600 hover:text-blue-900">
                                    Angalia Risiti
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination Links -->
            <div v-if="applications.links.length > 3" class="mt-6 flex justify-center">
                <div class="flex flex-wrap -mb-1">
                    <template v-for="(link, key) in applications.links" :key="key">
                        <div v-if="link.url === null" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded cursor-not-allowed" v-html="link.label" />
                        <Link
                            v-else
                            class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 transition-colors"
                            :class="{ 'bg-blue-600 text-white hover:bg-blue-700': link.active }" :href="link.url" v-html="link.label" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>