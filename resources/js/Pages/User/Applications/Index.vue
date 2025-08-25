<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

defineOptions({ layout: AuthenticatedLayout });

const props = defineProps({
    applications: Array,
    links: Array,
    title: String,
    csrf_token: String, // Ongeza hii
});
</script>

<template>
    <Head>
        <title>{{ title }}</title>
    </Head>
    <main class="py-10 px-4 max-w-5xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>
        <div class="mb-6">
            <Link :href="route('user.applications.create')" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow">
                Apply for Nomination
            </Link>
        </div>
        <div v-if="applications.length">
            <table class="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Category</th>
                        <th class="px-4 py-2">Name</th>
                        <th class="px-4 py-2">Status</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="app in applications" :key="app.id">
                        <td class="px-4 py-2">{{ app.category?.name }}</td>
                        <td class="px-4 py-2">{{ app.applicant_name }}</td>
                        <td class="px-4 py-2">{{ app.status }}</td>
                        <td class="px-4 py-2">
                            <Link :href="route('user.applications.show', app.id)" class="text-blue-600 hover:underline">View</Link>
                            <form
                                v-if="['pending_payment', 'payment_failed'].includes(app.status)"
                                :action="route('user.applications.retry-payment', app.id)"
                                method="post"
                                style="display:inline;"
                            >
                                <input type="hidden" name="_token" :value="csrf_token" />
                                <button type="submit" class="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                                    Retry Payment
                                </button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-gray-500 mt-8">
            You have not submitted any applications yet.
        </div>
        <!-- Pagination if needed -->
        <!-- <Pagination :links="links" /> -->
    </main>
</template>