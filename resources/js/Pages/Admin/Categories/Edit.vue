<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { defineProps } from 'vue';

const props = defineProps({
    category: Object,
    parentCategories: Array,
});

const form = useForm({
    _method: 'put',
    name: props.category.name,
    description: props.category.description,
    image: null,
    parent_id: props.category.parent_id || '', // Weka parent_id iliyopo
    status: props.category.status,
    nomination_fee: props.category.nomination_fee || 0,
});

const submit = () => {
    form.post(route('admin.categories.update', props.category.id), {
        // Hakuna haja ya onFinish hapa kwa sababu Inertia itarefresh page on success
    });
};

const onFileChange = (event) => {
    form.image = event.target.files[0];
};
</script>

<template>
    <Head title="Edit Category" />

    <AdminLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Category</h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900 dark:text-gray-100">

                        <form @submit.prevent="submit" class="max-w-md mx-auto mt-8">
                            <div>
                                <InputLabel for="name" value="Category Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    class="mt-1 block w-full"
                                    v-model="form.name"
                                    required
                                    autofocus
                                    autocomplete="name"
                                />
                                <InputError class="mt-2" :message="form.errors.name" />
                            </div>

                            <div class="mt-4">
                                <InputLabel for="parent_id" value="Parent Category (Optional)" />
                                <select
                                    id="parent_id"
                                    v-model="form.parent_id"
                                    class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="">-- No Parent (It's a Main Category) --</option>
                                    <option v-for="parent in parentCategories" :key="parent.id" :value="parent.id">
                                        {{ parent.name }}
                                    </option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.parent_id" />
                            </div>

                            <div class="mt-4">
                                <InputLabel for="description" value="Description" />
                                <textarea
                                    id="description"
                                    class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    v-model="form.description"
                                    autocomplete="description"
                                ></textarea>
                                <InputError class="mt-2" :message="form.errors.description" />
                            </div>

                            <!-- Nomination Fee (Only for sub-categories) -->
                            <div v-if="form.parent_id" class="mt-4">
                                <InputLabel for="nomination_fee" value="Nomination Fee (TZS)" />
                                <TextInput
                                    id="nomination_fee"
                                    type="number"
                                    class="mt-1 block w-full"
                                    v-model="form.nomination_fee"
                                    required
                                    min="0"
                                    step="1000"
                                    autocomplete="off"
                                />
                                <InputError class="mt-2" :message="form.errors.nomination_fee" />
                            </div>

                            <div class="mt-4">
                                <InputLabel for="image" value="Category Image (Leave blank to keep current)" />
                                <input
                                    id="image"
                                    type="file"
                                    class="mt-1 block w-full"
                                    @change="onFileChange"
                                />
                                <InputError class="mt-2" :message="form.errors.image" />
                                <div v-if="category.image_path" class="mt-4">
                                    <p>Current Image:</p>
                                    <img :src="`/storage/${category.image_path}`" alt="Current Category Image" class="mt-2 h-20 w-20 object-cover rounded-md">
                                </div>
                            </div>

                            <div class="mt-4">
                                <InputLabel for="status" value="Status" />
                                <select
                                    id="status"
                                    class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    v-model="form.status"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <InputError class="mt-2" :message="form.errors.status" />
                            </div>

                            <div class="flex items-center justify-end mt-4">
                                <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                                    Update Category
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>