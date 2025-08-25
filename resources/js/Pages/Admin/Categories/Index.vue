<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import FlashMessage from '@/Components/FlashMessage.vue';
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import { ref, watch, computed } from 'vue';
import debounce from 'lodash/debounce';

// Import icons
import EditIcon from '@/Components/Icons/EditIcon.vue';
import DeleteIcon from '@/Components/Icons/DeleteIcon.vue';
import ExportIcon from '@/Components/Icons/ExportIcon.vue';
import AddIcon from '@/Components/Icons/AddIcon.vue';
import Pagination from '@/Components/Pagination.vue';

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  categories: Object,
  filters: Object,
});

const page = usePage();
const successMessage = computed(() => page.props.flash.success);

const search = ref(props.filters.search || '');

watch(search, debounce((value) => {
  router.get(route('admin.categories.index'), { search: value }, {
    preserveState: true,
    replace: true,
  });
}, 300));

const deleteCategory = (category) => {
  if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
    router.delete(route('admin.categories.destroy', category.id), {
      preserveScroll: true,
    });
  }
};
</script>

<template>
  <Head title="Manage Categories" />

  <div class="p-6 text-gray-100">
    <FlashMessage :message="successMessage" />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gold-gradient">Awards Categories</h1>
      <div class="flex items-center space-x-2 md:space-x-3">
        <a
          :href="route('admin.categories.export.all-pdf')"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm"
          title="Export All Category Results to PDF"
          target="_blank"
        >
          <ExportIcon />
          <span class="hidden md:inline ml-2">Export All Results</span>
        </a>
        <Link
          :href="route('admin.categories.create')"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-gold-500 hover:bg-gold-600 text-gray-900 font-bold rounded-lg transition text-sm"
          title="Add New Category"
        >
          <AddIcon />
          <span class="hidden md:inline ml-2">Add New</span>
        </Link>
      </div>
    </div>

    <div class="mb-4">
   <input
  type="text"
  v-model="search"
  placeholder="Search categories by name..."
  class="block w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-md shadow-sm
         focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-800"
/>
    </div>

    <div class="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-300">
        <thead class="text-xs text-gold-400 uppercase bg-gray-700/50">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">Image</th>
            <th class="px-6 py-3">Category Name</th>
            <th class="px-6 py-3">Nominees</th>
            <th class="px-6 py-3">Slug</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categories.data.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-400">
              No categories found.
            </td>
          </tr>
          <tr
            v-for="(category, index) in categories.data"
            :key="category.id"
            class="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <td class="px-6 py-4">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-500 font-bold"
              >
                {{ category.name.charAt(0) }}
              </div>
            </td>
           <td class="px-6 py-4 font-medium text-white whitespace-nowrap">
  <Link
    :href="route('admin.categories.show', category.id)"
    class="hover:text-gold-400 transition duration-200 underline"
  >
    {{ category.name }}
  </Link>
</td>

            <td class="px-6 py-4">{{ category.nominees_count }}</td>
            <td class="px-6 py-4 font-mono text-gray-400">{{ category.slug }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end items-center space-x-2">
                <Link
                  :href="route('admin.categories.edit', category.id)"
                  class="text-blue-400 hover:text-blue-300"
                  title="Edit"
                >
                  <EditIcon />
                </Link>
                <button
                  @click="deleteCategory(category)"
                  class="text-red-500 hover:text-red-400"
                  title="Delete"
                >
                  <DeleteIcon />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="mt-6 flex justify-center">
      <Pagination :links="categories.links" />
    </div>
  </div>
</template>

<style scoped>
.text-gold-gradient {
  background: linear-gradient(to right, #D4AF37, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
