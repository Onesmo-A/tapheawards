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

defineOptions({
  layout: AdminLayout,
});

const props = defineProps({
  nominees: Object,
  filters: Object,
});

const page = usePage();
const successMessage = computed(() => page.props.flash.success);

const search = ref(props.filters.search || '');

watch(search, debounce((value) => {
  router.get(route('admin.nominees.index'), { search: value }, {
    preserveState: true,
    replace: true,
  });
}, 300));

const deleteNominee = (nominee) => {
  if (confirm(`Are you sure you want to delete the nominee "${nominee.name}"?`)) {
    router.delete(route('admin.nominees.destroy', nominee.id), {
      preserveScroll: true,
    });
  }
};
</script>

<template>
  <Head title="Manage Nominees" />

  <div class="p-6 text-gray-100">
    <FlashMessage :message="successMessage" />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gold-gradient">Nominees List</h1>
      <div class="flex items-center space-x-2 md:space-x-3">
        <a
          :href="route('admin.nominees.export')"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition text-sm"
          title="Export to Excel"
        >
          <ExportIcon />
          <span class="hidden md:inline ml-2">Export</span>
        </a>
        <Link
          :href="route('admin.nominees.create')"
          class="inline-flex items-center justify-center p-2 md:px-4 md:py-2 bg-gold-500 hover:bg-gold-600 text-gray-900 font-bold rounded-lg transition text-sm"
          title="Add New Nominee"
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
  placeholder="Search nominees by name..."
  class="block w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-md shadow-sm
         focus:ring-gold-500 focus:border-gold-500 text-gray-100 bg-gray-800"
/>

    </div>

    <div class="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-300 min-w-[600px]">
        <thead class="text-xs text-gold-400 uppercase bg-gray-700/50">
          <tr>
            <th class="px-4 py-3">Image</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3 hidden md:table-cell">Votes</th>
            <th class="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="nominees.data.length === 0">
            <td colspan="5" class="px-4 py-4 text-center text-gray-400">
              No nominees found.
            </td>
          </tr>

          <tr
            v-for="nominee in nominees.data"
            :key="nominee.id"
            class="border-b border-gray-700 hover:bg-gray-700/50 transition duration-200"
          >
            <td class="px-4 py-3">
              <img
                v-if="nominee.image_url"
                :src="nominee.image_url"
                :alt="nominee.name"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-500 font-bold"
              >
                {{ nominee.name ? nominee.name.charAt(0).toUpperCase() : '?' }}
              </div>
            </td>
            <td class="px-4 py-3 text-white font-medium">{{ nominee.name }}</td>
            <td class="px-4 py-3 text-gray-400">{{ nominee.category ? nominee.category.name : 'N/A' }}</td>
            <td class="px-4 py-3 text-gray-400 hidden md:table-cell">
              {{ nominee.votes_count }}
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end items-center space-x-2">
                <Link
                  :href="route('admin.nominees.edit', nominee.id)"
                  class="text-blue-400 hover:text-blue-300"
                  title="Edit"
                >
                  <EditIcon />
                </Link>
                <button
                  @click="deleteNominee(nominee)"
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

    <!-- Pagination Links -->
    <div v-if="nominees.links.length > 3" class="mt-6 flex justify-center">
      <div class="flex flex-wrap -mb-1">
        <template v-for="(link, key) in nominees.links" :key="key">
          <div v-if="link.url === null" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-500 border rounded-md border-gray-700" v-html="link.label" />
          <Link
            v-else
            class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded-md border-gray-700 hover:bg-gray-700 focus:border-gold-500 focus:text-gold-500 transition"
            :class="{ 'bg-gold-500 text-gray-900 font-bold': link.active }"
            :href="link.url"
            v-html="link.label"
          />
        </template>
      </div>
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
