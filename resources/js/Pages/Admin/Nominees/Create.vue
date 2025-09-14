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
  categories: Array,
  prefill: {
    type: Object,
    default: () => ({}),
  },
});

const form = useForm({
  name: props.prefill.name || '',
  category_id: props.prefill.category_id || '',
  bio: props.prefill.bio || '',
  image: null,
  image_path: props.prefill.image_path || null, // For displaying the pre-filled image path
  facebook_url: props.prefill.facebook_url || '',
  instagram_url: props.prefill.instagram_url || '',
  tiktok_url: props.prefill.tiktok_url || '',
  source_application_id: props.prefill.source_application_id || null,
});

const submit = () => {
  form.post(route('admin.nominees.store'), {
    onError: (errors) => {
      console.log(errors);
    },
  });
};
</script>

<template>
  <Head title="Add Nominee" />

  <div class="p-6 max-w-2xl mx-auto text-gray-100">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gold-400">
            {{ prefill.name ? 'Confirm & Create Nominee' : 'Add New Nominee' }}
        </h1>
        <p v-if="prefill.name" class="text-sm text-gray-400 mt-1">Review the details from the application and save the new nominee.</p>
    </div>

    <form @submit.prevent="submit" class="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <!-- Name -->
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

      <!-- Category -->
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

      <!-- Bio -->
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

      <!-- Facebook -->
      <div>
        <InputLabel for="facebook_url" value="Facebook URL (Optional)" class="text-gold-300" />
        <TextInput
          id="facebook_url"
          type="url"
          v-model="form.facebook_url"
          autocomplete="url"
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        />
        <InputError class="mt-2" :message="form.errors.facebook_url" />
      </div>

      <!-- Instagram -->
      <div>
        <InputLabel for="instagram_url" value="Instagram URL (Optional)" class="text-gold-300" />
        <TextInput
          id="instagram_url"
          type="url"
          v-model="form.instagram_url"
          autocomplete="url"
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        />
        <InputError class="mt-2" :message="form.errors.instagram_url" />
      </div>

      <!-- TikTok -->
      <div>
        <InputLabel for="tiktok_url" value="TikTok URL (Optional)" class="text-gold-300" />
        <TextInput
          id="tiktok_url"
          type="url"
          v-model="form.tiktok_url"
          autocomplete="url"
          class="mt-1 block w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-gold-500 focus:border-gold-500"
        />
        <InputError class="mt-2" :message="form.errors.tiktok_url" />
      </div>

      <!-- Image -->
      <div>
        <!-- Onyesha picha iliyopo kutoka kwenye application -->
        <div v-if="form.image_path && !form.image" class="mb-4">
            <InputLabel value="Current Image (from application)" class="text-gold-300 mb-2" />
            <img :src="`/storage/${form.image_path}`" alt="Current Nominee Image" class="h-32 w-32 rounded-md object-cover border-2 border-gray-600">
            <p class="text-xs text-gray-400 mt-2">You can upload a new image below to replace this one.</p>
        </div>

        <!-- Sehemu ya kupakia picha mpya -->
        <InputLabel for="image" value="Nominee Image (Optional)" class="text-gold-300" />
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
        
        <!-- Hidden input to carry over the existing image path if no new image is uploaded -->
        <input type="hidden" v-model="form.image_path" />
      </div>

      <!-- Buttons -->
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
          Save Nominee
        </PrimaryButton>
      </div>
    </form>
  </div>
</template>
