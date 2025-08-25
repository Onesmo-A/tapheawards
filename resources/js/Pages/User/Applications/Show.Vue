<script setup>
import { Head, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

defineOptions({ layout: AuthenticatedLayout });

const props = defineProps({
    application: Object,
    title: String,
});
</script>

<template>
    <Head>
        <title>{{ title }}</title>
    </Head>
    <main class="py-10 px-4 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>
        <div class="bg-white rounded shadow p-6">
            <div class="mb-4">
                <strong>Category:</strong> {{ application.category?.name }}
            </div>
            <div class="mb-4">
                <strong>Name:</strong> {{ application.applicant_name }}
            </div>
            <div class="mb-4">
                <strong>Status:</strong> {{ application.status }}
            </div>
            <div class="mb-4">
                <strong>Phone:</strong> {{ application.applicant_phone }}
            </div>
            <div class="mb-4">
                <strong>Email:</strong> {{ application.applicant_email }}
            </div>
            <div class="mb-4">
                <strong>Bio:</strong>
                <p class="mt-1 text-gray-700">{{ application.bio }}</p>
            </div>
            <div v-if="application.photo_path" class="mb-4">
                <strong>Photo:</strong>
                <img :src="`/storage/${application.photo_path}`" alt="Nominee Photo" class="w-32 h-32 object-cover rounded mt-2" />
            </div>
            <div v-if="application.transaction">
                <strong>Payment Status:</strong> {{ application.transaction.status }}
                <div v-if="['pending_payment', 'payment_failed'].includes(application.status)">
                    <form :action="route('user.applications.retry-payment', application.id)" method="post">
                        <input type="hidden" name="_token" :value="$page.props.csrf_token" />
                        <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-4">
                            Retry Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div class="mt-6">
            <Link :href="route('user.applications.index')" class="text-blue-600 hover:underline">Back to Applications</Link>
        </div>
    </main>
</template>