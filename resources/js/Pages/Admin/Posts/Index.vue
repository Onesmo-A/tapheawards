<template>
    <AdminLayout title="Manage Posts">
        <div class="text-white">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gold-400">Posts</h1>
                    <p class="mt-2 text-sm text-gray-300">A list of all the posts.</p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link :href="route('admin.posts.create')" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Post</Link>
                </div>
            </div>
            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="overflow-hidden shadow ring-1 ring-white/10 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-700">
                                <thead class="bg-gray-800">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Title</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Image</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Type</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-800 bg-gray-900">
                                <tr v-for="post in posts.data" :key="post.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{{ post.title }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        <img v-if="post.featured_image_url" :src="post.featured_image_url" :alt="post.title" class="h-10 w-10 rounded-md object-cover">
                                        <div v-else class="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        <span :class="[post.status === 'published' ? 'bg-green-400/10 text-green-400 ring-green-400/20' : 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20', 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">{{ post.status }}</span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300 capitalize">{{ post.type }}</td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <Link :href="route('admin.posts.edit', post.id)" class="text-gold-400 hover:text-gold-300">Edit</Link>
                                    </td>
                                </tr>
                                <tr v-if="posts.data.length === 0">
                                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-400">No posts found.</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Pagination -->
            <div v-if="posts.links.length > 3" class="mt-6">
                <Pagination :links="posts.links" />
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    posts: Object,
});
</script>