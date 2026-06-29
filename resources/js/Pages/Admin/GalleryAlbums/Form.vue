<template>
    <AdminLayout :title="form.id ? 'Edit Album' : 'Create Album'">
        <div class="text-white">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gold-400">{{ form.id ? 'Edit Album' : 'Create Album' }}</h1>
                    <p class="mt-2 text-sm text-gray-300">
                        {{ form.id ? `Update the details for album: ${album.name}` : 'Create a new gallery album.' }}
                    </p>
                </div>
            </div>

            <form @submit.prevent="submit" class="mt-8 bg-gray-900/50 border border-gold-500/10 shadow-2xl sm:rounded-xl md:col-span-2">
                <div class="px-4 py-6 sm:p-8">
                    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <!-- Name -->
                        <div class="sm:col-span-4">
                            <label for="name" class="block text-sm font-medium leading-6 text-gray-300">Name</label>
                            <div class="mt-2">
                                <input v-model="form.name" type="text" name="name" id="name" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6" />
                                <div v-if="form.errors.name" class="text-sm text-red-500 mt-1">{{ form.errors.name }}</div>
                            </div>
                        </div>

                        <!-- Published -->
                        <div class="sm:col-span-4">
                             <label for="is_published" class="block text-sm font-medium leading-6 text-gray-300">Status</label>
                            <div class="mt-2">
                                <select v-model="form.is_published" id="is_published" name="is_published" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6">
                                    <option :value="true">Published</option>
                                    <option :value="false">Draft</option>
                                </select>
                                <div v-if="form.errors.is_published" class="text-sm text-red-500 mt-1">{{ form.errors.is_published }}</div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="col-span-full">
                            <label for="description" class="block text-sm font-medium leading-6 text-gray-300">Description</label>
                            <div class="mt-2">
                                <textarea v-model="form.description" id="description" name="description" rows="3" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6" />
                            </div>
                            <p class="mt-3 text-sm leading-6 text-gray-400">A short description of the album.</p>
                            <div v-if="form.errors.description" class="text-sm text-red-500 mt-1">{{ form.errors.description }}</div>
                        </div>

                         <!-- Cover Image -->
                        <div class="col-span-full">
                            <label for="cover_image" class="block text-sm font-medium leading-6 text-gray-300">Cover Image</label>
                            <div class="mt-2">
                                <input type="file" @input="form.cover_image = $event.target.files[0]" class="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                                <div v-if="form.errors.cover_image" class="text-sm text-red-500 mt-1">{{ form.errors.cover_image }}</div>
                                <img v-if="album && album.cover_image_url" :src="album.cover_image_url" alt="Current Cover Image" class="mt-2 h-32 w-auto rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-x-6 border-t border-gold-500/10 px-4 py-4 sm:px-8">
                    <Link :href="route('admin.gallery-albums.index')" class="text-sm font-semibold leading-6 text-gray-300">Cancel</Link>
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

const props = defineProps({
    album: Object,
});

const form = useForm({
    _method: props.album ? 'PUT' : 'POST',
    id: props.album?.id || null,
    name: props.album?.name || '',
    description: props.album?.description || '',
    is_published: props.album ? props.album.is_published : true,
    cover_image: null,
});

const submit = () => {
    const url = props.album
        ? route('admin.gallery-albums.update', props.album.id)
        : route('admin.gallery-albums.store');

    form.post(url, {
        // forceFormData: true, // Uncomment if you add file uploads
    });
};
</script>