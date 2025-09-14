<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import TextareaInput from '@/Components/TextareaInput.vue';
import InputError from '@/Components/InputError.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    post: Object, // Hii itakuwepo kama tunahariri
});

const isEditing = !!props.post;

const form = useForm({
    _method: isEditing ? 'PUT' : 'POST',
    title: props.post?.title || '',
    excerpt: props.post?.excerpt || '',
    content: props.post?.content || '',
    type: props.post?.type || 'update',
    status: props.post?.status || 'draft',
    published_at: props.post?.published_at?.split(' ')[0] || new Date().toISOString().split('T')[0],
    featured_image: null,
});

const submit = () => {
    const url = isEditing ? route('admin.posts.update', props.post.id) : route('admin.posts.store');
    form.post(url, {
        // Tumia onFinish ili uweze kurudi nyuma baada ya form kujazwa
        onFinish: () => {
            // Optional: Unaweza ku-reset form hapa kama unataka
        },
    });
};

const onFileChange = (event) => {
    form.featured_image = event.target.files[0];
};
</script>

<template>
    <Head :title="isEditing ? 'Edit Post' : 'Create Post'" />

    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div class="sm:flex sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900">{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h1>
            <Link :href="route('admin.posts.index')">
                <SecondaryButton>Back to Posts</SecondaryButton>
            </Link>
        </div>

        <form @submit.prevent="submit" class="mt-8 bg-white p-6 rounded-lg shadow-md space-y-6">
            <!-- Title -->
            <div>
                <InputLabel for="title" value="Title" />
                <TextInput id="title" v-model="form.title" type="text" class="mt-1 block w-full" required />
                <InputError :message="form.errors.title" class="mt-2" />
            </div>

            <!-- Excerpt -->
            <div>
                <InputLabel for="excerpt" value="Excerpt (Short Summary)" />
                <TextareaInput id="excerpt" v-model="form.excerpt" class="mt-1 block w-full" rows="3" />
                <InputError :message="form.errors.excerpt" class="mt-2" />
            </div>

            <!-- Content -->
            <div>
                <InputLabel for="content" value="Full Content" />
                <TextareaInput id="content" v-model="form.content" class="mt-1 block w-full" rows="10" />
                <InputError :message="form.errors.content" class="mt-2" />
            </div>

            <!-- Featured Image -->
            <div>
                <InputLabel for="featured_image" value="Featured Image" />
                <input type="file" @input="onFileChange" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                <InputError :message="form.errors.featured_image" class="mt-2" />
                <div v-if="post?.featured_image_url && !form.featured_image" class="mt-4">
                    <p class="text-sm text-gray-500">Current Image:</p>
                    <img :src="post.featured_image_url" alt="Current Image" class="mt-2 h-32 w-auto rounded-md">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Type -->
                <div>
                    <InputLabel for="type" value="Post Type" />
                    <select id="type" v-model="form.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="update">Update</option>
                        <option value="gallery">Gallery</option>
                        <option value="event">Event</option>
                    </select>
                    <InputError :message="form.errors.type" class="mt-2" />
                </div>

                <!-- Status -->
                <div>
                    <InputLabel for="status" value="Status" />
                    <select id="status" v-model="form.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <InputError :message="form.errors.status" class="mt-2" />
                </div>

                <!-- Published At -->
                <div>
                    <InputLabel for="published_at" value="Publish Date" />
                    <TextInput id="published_at" v-model="form.published_at" type="date" class="mt-1 block w-full" />
                    <InputError :message="form.errors.published_at" class="mt-2" />
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex items-center justify-end">
                <PrimaryButton :disabled="form.processing">
                    {{ isEditing ? 'Update Post' : 'Create Post' }}
                </PrimaryButton>
            </div>
        </form>
    </div>
</template>