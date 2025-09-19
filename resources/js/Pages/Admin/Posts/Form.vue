<template>
    <AdminLayout :title="form.id ? 'Edit Post' : 'Create Post'">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">{{ form.id ? 'Edit Post' : 'Create Post' }}</h1>
                    <p class="mt-2 text-sm text-gray-700">
                        {{ form.id ? `Update the details for post: ${post.title}` : 'Create a new post for news, events, or gallery.' }}
                    </p>
                </div>
            </div>

            <form @submit.prevent="submit" class="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div class="px-4 py-6 sm:p-8">
                    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <!-- Title -->
                        <div class="sm:col-span-4">
                            <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                            <div class="mt-2">
                                <input v-model="form.title" type="text" name="title" id="title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <div v-if="form.errors.title" class="text-sm text-red-600 mt-1">{{ form.errors.title }}</div>
                            </div>
                        </div>

                        <!-- Type -->
                        <div class="sm:col-span-3">
                            <label for="type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <div class="mt-2">
                                <select v-model="form.type" id="type" name="type" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <option value="update">Update (News)</option>
                                    <option value="gallery">Gallery Photo</option>
                                    <option value="event">Event</option>
                                </select>
                                <div v-if="form.errors.type" class="text-sm text-red-600 mt-1">{{ form.errors.type }}</div>
                            </div>
                        </div>

                        <!-- Status -->
                        <div class="sm:col-span-3">
                            <label for="status" class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                            <div class="mt-2">
                                <select v-model="form.status" id="status" name="status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                <div v-if="form.errors.status" class="text-sm text-red-600 mt-1">{{ form.errors.status }}</div>
                            </div>
                        </div>

                        <!-- Gallery Album (Conditional) -->
                        <div v-if="form.type === 'gallery'" class="sm:col-span-4">
                            <label for="gallery_album_id" class="block text-sm font-medium leading-6 text-gray-900">Gallery Album</label>
                            <div class="mt-2">
                                <select v-model="form.gallery_album_id" id="gallery_album_id" name="gallery_album_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <option :value="null">-- Select an Album --</option>
                                    <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.name }}</option>
                                </select>
                                <div v-if="form.errors.gallery_album_id" class="text-sm text-red-600 mt-1">{{ form.errors.gallery_album_id }}</div>
                            </div>
                        </div>

                        <!-- Published At -->
                        <div class="sm:col-span-4">
                            <label for="published_at" class="block text-sm font-medium leading-6 text-gray-900">Publish Date</label>
                            <div class="mt-2">
                                <input v-model="form.published_at" type="datetime-local" name="published_at" id="published_at" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                <div v-if="form.errors.published_at" class="text-sm text-red-600 mt-1">{{ form.errors.published_at }}</div>
                            </div>
                        </div>

                        <!-- Excerpt -->
                        <div class="col-span-full">
                            <label for="excerpt" class="block text-sm font-medium leading-6 text-gray-900">Excerpt</label>
                            <div class="mt-2">
                                <textarea v-model="form.excerpt" id="excerpt" name="excerpt" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <p class="mt-3 text-sm leading-6 text-gray-600">A short summary of the post.</p>
                            <div v-if="form.errors.excerpt" class="text-sm text-red-600 mt-1">{{ form.errors.excerpt }}</div>
                        </div>

                        <!-- Content -->
                        <div class="col-span-full">
                            <label for="content" class="block text-sm font-medium leading-6 text-gray-900">Content</label>
                            <div class="mt-2">
                                <textarea v-model="form.content" id="content" name="content" rows="10" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                             <div v-if="form.errors.content" class="text-sm text-red-600 mt-1">{{ form.errors.content }}</div>
                        </div>

                        <!-- Featured Image -->
                        <div class="col-span-full">
                            <label for="featured_image" class="block text-sm font-medium leading-6 text-gray-900">Featured Image</label>
                            <div class="mt-2">
                                <input type="file" @input="form.featured_image = $event.target.files[0]" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                                <progress v-if="form.progress" :value="form.progress.percentage" max="100">{{ form.progress.percentage }}%</progress>
                                <div v-if="form.errors.featured_image" class="text-sm text-red-600 mt-1">{{ form.errors.featured_image }}</div>
                                <div v-if="post && post.featured_image_url" class="mt-4">
                                    <p class="text-sm font-medium">Current Image:</p>
                                    <img :src="post.featured_image_url" alt="Current featured image" class="mt-2 h-32 w-auto rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <Link :href="route('admin.posts.index')" class="text-sm font-semibold leading-6 text-gray-900">Cancel</Link>
                    <button type="submit" :disabled="form.processing" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {{ form.processing ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
    post: Object,
    albums: Array,
});

const form = useForm({
    _method: props.post ? 'PUT' : 'POST',
    id: props.post?.id || null,
    title: props.post?.title || '',
    excerpt: props.post?.excerpt || '',
    content: props.post?.content || '',
    type: props.post?.type || 'update',
    status: props.post?.status || 'draft',
    published_at: props.post?.published_at ? new Date(props.post.published_at).toISOString().slice(0, 16) : null,
    gallery_album_id: props.post?.gallery_album_id || null,
    featured_image: null,
});

const submit = () => {
    const url = props.post
        ? route('admin.posts.update', props.post.id)
        : route('admin.posts.store');

    form.post(url, {
        forceFormData: true, // Important for file uploads
    });
};
</script>