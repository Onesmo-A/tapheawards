<template>
    <AdminLayout title="Manage Reels">
        <div class="px-4 sm:px-6 lg:px-8 text-white">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gold-400">Reels</h1>
                    <p class="mt-2 text-sm text-gray-300">A list of all the reels from Instagram or YouTube.</p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link :href="route('admin.reels.create')" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Reel</Link>
                </div>
            </div>
            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="overflow-hidden shadow ring-1 ring-white/10 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-700">
                                <thead class="bg-gray-800">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Content URL</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Type</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-800 bg-gray-900">
                                <tr v-for="reel in reels.data" :key="reel.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                                        <a :href="reel.content" target="_blank" class="hover:text-gold-400">{{ reel.content.substring(0, 50) }}...</a>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300 capitalize">{{ reel.type }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        <span :class="[reel.is_active ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20', 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">
                                            {{ reel.is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <Link :href="route('admin.reels.edit', reel.id)" class="text-gold-400 hover:text-gold-300">Edit</Link>
                                    </td>
                                </tr>
                                <tr v-if="reels.data.length === 0">
                                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-400">No reels found.</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Pagination would go here -->
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    reels: Object,
});
</script>