<!-- resources/js/Pages/Admin/Categories/Edit.vue -->
<script setup>
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
  layout: AdminLayout
});

const props = defineProps({
  category: Object,
});

const form = useForm({
  name: props.category.name || '',
  description: props.category.description || '',
  image: null,
  _method: 'put', // Hii inaeleza ni update
});

const imageUrl = ref(props.category.image_url);

const updateImagePreview = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.image = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

const submit = () => {
  form.post(route('admin.categories.update', props.category.id));
};
</script>

<template>
  <Head title="Edit Category" />

  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gold-400 mb-6">
      Edit Category: {{ category.name }}
    </h2>

    <form @submit.prevent="submit" class="space-y-6">
      <!-- Category Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300">Category Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="mt-1 block w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          :class="{ 'border-red-500': form.errors.name }"
          required
        />
        <p v-if="form.errors.name" class="mt-2 text-sm text-red-500">{{ form.errors.name }}</p>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          rows="3"
          v-model="form.description"
          class="mt-1 block w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          :class="{ 'border-red-500': form.errors.description }"
        ></textarea>
        <p v-if="form.errors.description" class="mt-2 text-sm text-red-500">{{ form.errors.description }}</p>
      </div>

      <!-- Image -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-300">Category Image</label>
        <div class="mt-2">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="category.name"
            class="h-24 w-24 object-cover rounded mb-3 border border-gray-700"
          />
          <input
            type="file"
            id="image"
            @input="updateImagePreview"
            class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-gold-500 file:text-gray-900 hover:file:bg-gold-600"
          />
          <p v-if="form.errors.image" class="mt-2 text-sm text-red-500">{{ form.errors.image }}</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="form.processing"
          class="inline-flex items-center px-4 py-2 bg-gold-500 border border-transparent rounded-md font-semibold text-sm text-gray-900 hover:bg-gold-600 disabled:opacity-50"
        >
          Update Category
        </button>
      </div>
    </form>
  </div>
</template>
