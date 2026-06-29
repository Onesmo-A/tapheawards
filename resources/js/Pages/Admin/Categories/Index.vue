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
const perPage = ref(props.filters.per_page || '20');

watch([search, perPage], debounce(() => {
  router.get(route('admin.categories.index'), {
    search: search.value,
    per_page: perPage.value,
  }, {
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

const toggleVoting = (category) => {
  router.patch(route('admin.categories.toggle-voting', category.id), {}, {
    preserveScroll: true,
  });
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

    <div class="mb-4 grid gap-4 md:grid-cols-[1fr_auto] items-center">
      <input
        type="text"
        v-model="search"
        placeholder="Search categories by name..."
        class="block w-full md:w-auto px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-800"
      />

      <div class="flex items-center gap-2">
        <label for="per_page" class="text-sm text-gray-300">Show:</label>
        <select
          id="per_page"
          v-model="perPage"
          class="px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100"
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>

    <div class="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-300">
        <thead class="text-xs text-gold-400 uppercase bg-gray-700/50">
          <tr>
            <th class="px-6 py-3">#</th>
            <th class="px-6 py-3">Image</th>
            <th class="px-6 py-3">Main Group</th>
            <th class="px-6 py-3">Category</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Voting</th>
            <th class="px-6 py-3">Fee (TZS)</th>
            <th class="px-6 py-3">Nominees</th>
            <th class="px-6 py-3">Slug</th>
            <th class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="categories.data.length === 0">
            <td colspan="10" class="px-6 py-4 text-center text-gray-400">
              No categories found.
            </td>
          </tr>

          <template v-for="(category, index) in categories.data" :key="category.id">
            <!-- Main Group row (parent_id = null) -->
            <tr
              v-if="!category.parent_id"
              class="border-b border-gray-700 bg-gray-800 hover:bg-gray-800/80 transition-colors"
            >
              <td class="px-6 py-4">{{ categories.from + index }}</td>
              <td class="px-6 py-4">
                <img
                  v-if="category.image_path"
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

              <!-- Main group is the parent itself, so show just its own name -->
              <td class="px-6 py-4 text-gray-100 whitespace-nowrap">{{ category.name }}</td>
              <td class="px-6 py-4 text-gray-400">—</td>

              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="category.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'"
                >
                  {{ category.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/20 text-gray-300">N/A</span>
              </td>
              <td class="px-6 py-4">N/A</td>
              <td class="px-6 py-4">{{ category.nominees_count }}</td>
              <td class="px-6 py-4 font-mono text-gray-400">{{ category.slug }}</td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2">
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

            <!-- Child category row -->
            <tr
              v-else
              class="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
            >
              <td class="px-6 py-4">{{ categories.from + index }}</td>
              <td class="px-6 py-4">
                <img
                  v-if="category.image_path"
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

              <td class="px-6 py-4 text-gray-300 whitespace-nowrap">
                {{ category.parent ? category.parent.name : '—' }}
              </td>
              <td class="px-6 py-4 font-medium text-white whitespace-nowrap">
                <Link
                  :href="route('admin.categories.show', category.id)"
                  class="hover:text-gold-400 transition duration-200 underline"
                >
                  {{ category.name }}
                </Link>
              </td>

              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="category.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'"
                >
                  {{ category.status }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="category.voting_enabled ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'"
                >
                  {{ category.voting_enabled ? 'Enabled' : 'Disabled' }}
                </span>
              </td>

              <td class="px-6 py-4">{{ Number(category.nomination_fee).toLocaleString() }}</td>
              <td class="px-6 py-4">{{ category.nominees_count }}</td>
              <td class="px-6 py-4 font-mono text-gray-400">{{ category.slug }}</td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-2">
                  <button
                    @click="toggleVoting(category)"
                    class="px-3 py-1.5 rounded-md text-xs font-semibold transition"
                    :class="category.voting_enabled ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'"
                  >
                    {{ category.voting_enabled ? 'Disable Vote' : 'Enable Vote' }}
                  </button>

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
          </template>
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex justify-center">
      <Pagination :links="categories.links" />
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-track {
  background: #1f2937;
}
::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 6px;
  border: 3px solid #1f2937;
}
</style>

