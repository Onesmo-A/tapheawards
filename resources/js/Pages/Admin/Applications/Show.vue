<template>
    <AdminLayout :title="`Application: ${application.applicant_name}`">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto">
                <!-- Header -->
                <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-start justify-between">
                            <div>
                                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">{{ application.applicant_name }}</h2>
                                <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                    <div class="mt-2 flex items-center text-sm text-gray-500">
                                        <FolderIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        {{ application.category.name }}
                                    </div>
                                    <div class="mt-2 flex items-center text-sm text-gray-500">
                                        <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                        Submitted by: {{ application.user.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="ml-4 mt-0 flex-shrink-0">
                                <span :class="statusClass(application.status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                    {{ formatStatus(application.status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Application Details -->
                <div class="mt-6 bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Application Details</h3>
                        <div class="mt-5 border-t border-gray-200">
                            <dl class="divide-y divide-gray-200">
                                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-500">Applicant Photo</dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <img v-if="application.photo_path" :src="`/storage/${application.photo_path}`" alt="Applicant Photo" class="h-32 w-32 rounded-md object-cover">
                                        <span v-else class="text-gray-500">No photo provided.</span>
                                    </dd>
                                </div>
                                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-500">Bio / Profile</dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0" v-html="application.bio"></dd>
                                </div>
                                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-500">Contact</dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <p>{{ application.applicant_email }}</p>
                                        <p>{{ application.applicant_phone }}</p>
                                    </dd>
                                </div>
                                <!-- Social Links -->
                                <div v-if="application.facebook_url || application.instagram_url || application.tiktok_url" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-500">Social Links</dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <ul>
                                            <li v-if="application.facebook_url"><a :href="application.facebook_url" target="_blank" class="text-indigo-600 hover:underline">Facebook</a></li>
                                            <li v-if="application.instagram_url"><a :href="application.instagram_url" target="_blank" class="text-indigo-600 hover:underline">Instagram</a></li>
                                            <li v-if="application.tiktok_url"><a :href="application.tiktok_url" target="_blank" class="text-indigo-600 hover:underline">TikTok</a></li>
                                        </ul>
                                    </dd>
                                </div>
                                <!-- Transaction Details -->
                                <div v-if="application.transaction" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                                    <dt class="text-sm font-medium text-gray-500">Payment</dt>
                                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        <p>Amount: {{ application.transaction.amount }} {{ application.transaction.currency }}</p>
                                        <p>Status: <span :class="statusClass(application.transaction.status)">{{ formatStatus(application.transaction.status) }}</span></p>
                                        <p>Order ID: {{ application.transaction.order_id }}</p>
                                        <p>Gateway Ref: {{ application.transaction.gateway_reference || 'N/A' }}</p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div v-if="application.status === 'pending_review'" class="mt-6 bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-base font-semibold leading-6 text-gray-900">Actions</h3>
                        <div class="mt-4 flex items-center space-x-4">
                            <button @click="processApplication('approve')" type="button" class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                Approve & Create Nominee
                            </button>
                            <button @click="showRejectionModal = true" type="button" class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rejection Modal -->
        <Modal :show="showRejectionModal" @close="showRejectionModal = false">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">Reject Application</h2>
                <p class="mt-1 text-sm text-gray-600">Please provide a reason for rejecting this application. This will be visible to the user.</p>
                <div class="mt-4">
                    <textarea v-model="form.rejection_reason" rows="4" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Reason for rejection..."></textarea>
                    <InputError class="mt-2" :message="form.errors.rejection_reason" />
                </div>
                <div class="mt-6 flex justify-end">
                    <SecondaryButton @click="showRejectionModal = false">Cancel</SecondaryButton>
                    <DangerButton class="ml-3" @click="processApplication('reject')" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        Confirm Rejection
                    </DangerButton>
                </div>
            </div>
        </Modal>
    </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { FolderIcon, UserIcon } from '@heroicons/vue/20/solid';
import Modal from '@/Components/Modal.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import InputError from '@/Components/InputError.vue';

const props = defineProps({
    application: Object,
});

const showRejectionModal = ref(false);

const form = useForm({
    action: '',
    rejection_reason: '',
});

const processApplication = (action) => {
    form.action = action;
    form.put(route('admin.applications.update', props.application.id), {
        preserveScroll: true,
        onSuccess: () => {
            if (action === 'reject') {
                showRejectionModal.value = false;
                form.reset();
            }
        },
    });
};

const formatStatus = (status) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const statusClass = (status) => {
    const classes = {
        'pending_review': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        'pending_payment': 'bg-blue-50 text-blue-800 ring-blue-600/20',
        'approved': 'bg-green-50 text-green-700 ring-green-600/20',
        'completed': 'bg-green-50 text-green-700 ring-green-600/20',
        'rejected': 'bg-red-50 text-red-700 ring-red-600/10',
        'payment_failed': 'bg-red-50 text-red-700 ring-red-600/10',
        'failed': 'bg-red-50 text-red-700 ring-red-600/10',
        'pending': 'bg-blue-50 text-blue-800 ring-blue-600/20',
    };
    return classes[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};
</script>
