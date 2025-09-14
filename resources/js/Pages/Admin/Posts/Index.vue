<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';
import DangerButton from '@/Components/DangerButton.vue';
import Modal from '@/Components/Modal.vue';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    posts: Object,
});

const confirmingPostDeletion = ref(false);
const form = useForm({});
const postToDelete = ref(null);

const confirmPostDeletion = (post) => {
    postToDelete.value = post;
    confirmingPostDeletion.value = true;
};

const deletePost = () => {
    form.delete(route('admin.posts.destroy', postToDelete.value.id), {
        onSuccess: () => closeModal(),
    });
};

const closeModal = () => {
    confirmingPostDeletion.value = false;
    postToDelete.value = null;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};
</script>

<template>
    <Head title="Manage Posts" />

    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">Manage Posts</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all posts including updates, gallery items, and events.</p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link :href="route('admin.posts.create')">
                    <PrimaryButton>Add Post</PrimaryButton>
                </Link>
            </div>
        </div>
        <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Published At</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="post in posts.data" :key="post.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ post.title }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ post.type }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span :class="[post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800', 'inline-flex rounded-full px-2 text-xs font-semibold leading-5']">
                                            {{ post.status }}
                                        </span>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatDate(post.published_at) }}</td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                        <Link :href="route('posts.show', post.slug)" target="_blank" class="text-indigo-600 hover:text-indigo-900 inline-block"><EyeIcon class="h-5 w-5"/></Link>
                                        <Link :href="route('admin.posts.edit', post.id)" class="text-indigo-600 hover:text-indigo-900 inline-block"><PencilIcon class="h-5 w-5"/></Link>
                                        <button @click="confirmPostDeletion(post)" class="text-red-600 hover:text-red-900 inline-block"><TrashIcon class="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal :show="confirmingPostDeletion" @close="closeModal">
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">Are you sure you want to delete this post?</h2>
            <p class="mt-1 text-sm text-gray-600">"{{ postToDelete?.title }}"</p>
            <div class="mt-6 flex justify-end">
                <SecondaryButton @click="closeModal">Cancel</SecondaryButton>
                <DangerButton class="ml-3" @click="deletePost">Delete Post</DangerButton>
            </div>
        </div>
    </Modal>
</template>