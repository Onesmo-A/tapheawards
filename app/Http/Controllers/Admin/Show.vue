<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue';
import { Head } from '@inertiajs/vue3';

defineOptions({ layout: DefaultLayout });

const props = defineProps({
    post: Object,
});
</script>

<template>
    <Head :title="post.title" />

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>

                    <div v-if="post.featured_image_url">
                        <img :src="post.featured_image_url" :alt="post.title" class="mb-4 rounded-md">
                    </div>

                    <div class="prose" v-html="post.content"></div>

                    <div v-if="post.media_gallery && post.media_gallery.length">
                        <h2 class="text-2xl font-semibold mt-6">Media Gallery</h2>
                        <div class="flex flex-wrap gap-4 mt-4">
                            <img v-for="(media, index) in post.media_gallery" :key="index" :src="media" alt="Media"
                                class="w-32 h-32 object-cover rounded-md">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>