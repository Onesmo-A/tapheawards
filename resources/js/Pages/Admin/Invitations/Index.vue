<script setup>
import { ref, watch } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import AdminLayout from '@/Layouts/AdminLayout.vue'; 
import Pagination from '@/Components/Pagination.vue';
import { ClipboardDocumentIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    invitations: Object,
    filters: Object,
    baseUrl: String,
});

const search = ref(props.filters.search);
const rsvpStatus = ref(props.filters.rsvp_status);

watch([search, rsvpStatus], debounce(function ([searchValue, rsvpValue]) {
    router.get(route('admin.invitations.index'), {
        search: searchValue,
        rsvp_status: rsvpValue,
    }, {
        preserveState: true,
        replace: true,
    });
}, 300));

const copyToClipboard = (uuid) => {
    const url = `${props.baseUrl}/invitation/${uuid}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('Invitation link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const deleteInvitation = (id) => {
    if (confirm('Are you sure you want to delete this invitation?')) {
        router.delete(route('admin.invitations.destroy', id), {
            preserveScroll: true,
        });
    }
};

const getRsvpBadgeClass = (status) => {
    switch (status) {
        case 'attending': return 'bg-green-500 text-white';
        case 'declined': return 'bg-red-500 text-white';
        default: return 'bg-gray-500 text-gray-200';
    }
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'viewed': return 'bg-blue-500 text-white';
        case 'sent': return 'bg-yellow-500 text-black';
        default: return 'bg-gray-600 text-gray-200';
    }
};

const exportPdf = () => {
    const params = new URLSearchParams({
        search: search.value || '',
        rsvp_status: rsvpStatus.value || '',
    }).toString();
    const url = `${route('admin.invitations.export.pdf')}?${params}`;
    window.open(url, '_blank');
};
</script>

<template>
    <Head title="Guest Invitations" />

    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-bold text-white">Guest Invitations</h1>
                <p class="mt-2 text-sm text-gray-300">A list of all the VIP guest invitations including their name, title, and RSVP status.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-x-2">
                <Link :href="route('admin.invitations.create')" class="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                    Add Invitation
                </Link>
                <button @click="exportPdf" type="button" class="inline-flex items-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600">
                    Export PDF
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
                <input v-model="search" type="text" placeholder="Search by name or title..." class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
            <div>
                <select v-model="rsvpStatus" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6">
                    <option :value="null" class="text-black">All RSVP Statuses</option>
                    <option value="pending" class="text-black">Pending</option>
                    <option value="attending" class="text-black">Attending</option>
                    <option value="declined" class="text-black">Declined</option>
                </select>
            </div>
        </div>

        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-700">
                            <thead class="bg-gray-800">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Guest Name</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Title</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Card Status</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">RSVP Status</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Created At</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800 bg-gray-900">
                                <tr v-if="invitations.data.length === 0">
                                    <td colspan="6" class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400">No invitations found.</td>
                                </tr>
                                <tr v-for="invitation in invitations.data" :key="invitation.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{{ invitation.guest_name }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ invitation.guest_title }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="getStatusBadgeClass(invitation.status)">
                                            {{ invitation.status }}
                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                                        <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium" :class="getRsvpBadgeClass(invitation.rsvp_status)">
                                            {{ invitation.rsvp_status }}
                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ new Date(invitation.created_at).toLocaleDateString() }}</td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div class="flex items-center justify-end gap-x-4">
                                            <button @click="copyToClipboard(invitation.uuid)" title="Copy Link" class="text-sky-400 hover:text-sky-300">
                                                <ClipboardDocumentIcon class="h-5 w-5" />
                                            </button>
                                            <Link :href="route('admin.invitations.edit', invitation.id)" class="text-yellow-400 hover:text-yellow-300">
                                                <PencilIcon class="h-5 w-5" />
                                            </Link>
                                            <button @click="deleteInvitation(invitation.id)" class="text-red-500 hover:text-red-400">
                                                <TrashIcon class="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Pagination :links="invitations.links" class="mt-6" />
    </div>
</template>