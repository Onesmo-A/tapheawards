<template>
    <AdminLayout :title="form.id ? 'Edit Reel' : 'Create Reel'">
        <div class="text-white">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gold-400">{{ form.id ? 'Edit Reel' : 'Create Reel' }}</h1>
                    <p class="mt-2 text-sm text-gray-300">
                        {{ form.id ? `Update the details for the reel.` : 'Add a new reel from Instagram or YouTube.' }}
                    </p>
                </div>
            </div>

            <form @submit.prevent="submit" class="mt-8 bg-gray-900/50 border border-gold-500/10 shadow-2xl sm:rounded-xl md:col-span-2">
                <div class="px-4 py-6 sm:p-8">
                    <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <!-- Type -->
                        <div class="sm:col-span-4">
                            <label for="type" class="block text-sm font-medium leading-6 text-gray-300">Type</label>
                            <div class="mt-2">
                                <select v-model="form.type" id="type" name="type" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6">
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                </select>
                                <div v-if="form.errors.type" class="text-sm text-red-500 mt-1">{{ form.errors.type }}</div>
                            </div>
                        </div>

                        <!-- Content URL -->
                        <div class="col-span-full">
                            <label for="content" class="block text-sm font-medium leading-6 text-gray-300">Content URL</label>
                            <div class="mt-2">
                                <input v-model="form.content" type="url" name="content" id="content" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6" placeholder="https://www.instagram.com/reel/..." />
                                <div v-if="form.errors.content" class="text-sm text-red-500 mt-1">{{ form.errors.content }}</div>
                            </div>
                        </div>

                        <!-- Active -->
                        <div class="sm:col-span-4">
                             <label for="is_active" class="block text-sm font-medium leading-6 text-gray-300">Status</label>
                            <div class="mt-2">
                                <select v-model="form.is_active" id="is_active" name="is_active" class="block w-full rounded-md border-0 py-1.5 bg-white/5 text-white shadow-sm ring-1 ring-inset ring-gold-500/20 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6">
                                    <option :value="true">Active</option>
                                    <option :value="false">Inactive</option>
                                </select>
                                <div v-if="form.errors.is_active" class="text-sm text-red-500 mt-1">{{ form.errors.is_active }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-x-6 border-t border-gold-500/10 px-4 py-4 sm:px-8">
                    <Link :href="route('admin.reels.index')" class="text-sm font-semibold leading-6 text-gray-300">Cancel</Link>
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
    reel: Object,
});

const form = useForm({
    _method: props.reel ? 'PUT' : 'POST',
    id: props.reel?.id || null,
    type: props.reel?.type || 'instagram',
    content: props.reel?.content || '',
    is_active: props.reel ? props.reel.is_active : true,
});

const submit = () => {
    const url = props.reel
        ? route('admin.reels.update', props.reel.id)
        : route('admin.reels.store');

    form.post(url);
};
</script>