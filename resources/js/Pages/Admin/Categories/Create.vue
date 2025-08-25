<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

defineOptions({
    layout: AdminLayout
});

const form = useForm({
    name: '',
    description: '',
    image: null,
});

const submit = () => {
    form.post(route('admin.categories.store'));
};
</script>

<template>
  <Head title="Create Category" />

  <div class="p-6 max-w-3xl mx-auto text-gray-200">
    <h1 class="text-2xl font-bold mb-6 text-gold-gradient">Create New Category</h1>

    <form @submit.prevent="submit" class="space-y-6 bg-gray-800/50 p-6 rounded-lg shadow-md">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300">Category Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          class="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-gray-200 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          :class="{ 'border-red-500': form.errors.name }"
        />
        <p v-if="form.errors.name" class="mt-1 text-sm text-red-500">{{ form.errors.name }}</p>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-gray-200 focus:ring-gold-500 focus:border-gold-500 sm:text-sm"
          :class="{ 'border-red-500': form.errors.description }"
        ></textarea>
        <p v-if="form.errors.description" class="mt-1 text-sm text-red-500">{{ form.errors.description }}</p>
      </div>

      <!-- Image -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-300">Category Image</label>
        <input
          id="image"
          type="file"
          @input="form.image = $event.target.files[0]"
          class="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-gold-500 file:text-gray-900 hover:file:bg-gold-600"
        />
        <p v-if="form.errors.image" class="mt-1 text-sm text-red-500">{{ form.errors.image }}</p>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="form.processing"
          class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50"
        >
          {{ form.processing ? 'Saving...' : 'Create Category' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #D4AF37, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
