<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm, Link } from '@inertiajs/vue3';

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  nominee: Object,
  categories: Array,
});

const form = useForm({
  _method: 'PUT', // for file uploads and method spoofing PUT
  name: props.nominee.name,
  category_id: props.nominee.category_id,
  bio: props.nominee.bio || '',
  image: null,
});

const submit = () => {
  form.post(route('admin.nominees.update', props.nominee.id), {
    onError: (errors) => {
      console.log(errors);
    },
  });
};
</script>

<template>
  <Head :title="`Edit Nominee: ${nominee.name}`" />

  <div class="p-6 max-w-2xl mx-auto text-gray-100">
    <h1 class="text-2xl font-bold text-gold-400 mb-6">Edit Nominee: {{ nominee.name }}</h1>

    <form @submit.prevent="submit" class="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div>
        <InputLabel for="name" value="Nominee Name" class="text-gold-300" />
        <TextInput
          id="name"
          type="text"
          v-model="form.name"
          required
          autofocus
          autocomplete="name"
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        />
        <InputError class="mt-2" :message="form.errors.name" />
      </div>

      <div>
        <InputLabel for="category_id" value="Category" class="text-gold-300" />
        <select
          id="category_id"
          v-model="form.category_id"
          required
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <InputError class="mt-2" :message="form.errors.category_id" />
      </div>

      <div>
        <InputLabel for="bio" value="Biography (Optional)" class="text-gold-300" />
        <textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        ></textarea>
        <InputError class="mt-2" :message="form.errors.bio" />
      </div>

      <div>
        <InputLabel for="image" value="New Nominee Image (Optional)" class="text-gold-300" />
        <div v-if="nominee.image_url" class="my-2">
          <p class="text-sm text-gray-400">Current Image:</p>
          <img
            :src="nominee.image_url"
            :alt="nominee.name"
            class="w-32 h-32 object-cover rounded-md mt-1"
          />
        </div>
        <input
          type="file"
          id="image"
          @input="form.image = $event.target.files[0]"
          class="mt-1 block w-full text-gray-400 text-sm
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-gold-500 file:text-gray-900 hover:file:bg-gold-600"
        />
        <progress
          v-if="form.progress"
          :value="form.progress.percentage"
          max="100"
          class="w-full mt-2 text-gold-400"
        >
          {{ form.progress.percentage }}%
        </progress>
        <InputError class="mt-2" :message="form.errors.image" />
      </div>

      <div class="flex justify-between items-center mt-6">
        <Link
          :href="route('admin.nominees.index')"
          class="text-sm text-gray-400 hover:text-gray-200 underline"
        >
          Cancel
        </Link>
        <PrimaryButton
          :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
          :disabled="form.processing"
        >
          Update Nominee
        </PrimaryButton>
      </div>
    </form>
  </div>
</template>
