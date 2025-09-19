<script setup>
import { ref, watch } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { debounce } from 'lodash';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import Pagination from '@/Components/Pagination.vue';
import { MagnifyingGlassIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';

defineOptions({ layout: AdminLayout });

const props = defineProps({
    users: Object,
    filters: Object,
});

const search = ref(props.filters.search);
const role = ref(props.filters.role);

const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
];

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

watch([search, role], debounce(function ([searchValue, roleValue]) {
    router.get(route('admin.users.index'), {
        search: searchValue,
        role: roleValue,
    }, {
        preserveState: true,
        replace: true,
    });
}, 300));

</script>

<template>
    <Head title="User Management" />

    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h2 class="text-2xl font-bold text-white">User Management</h2>
            <p class="mt-1 text-sm text-gray-400">View and manage all registered users.</p>
        </div>
    </div>

    <!-- Filters and Table -->
    <div class="bg-gray-800/50 border border-gold-500/10 shadow-2xl overflow-hidden sm:rounded-2xl">
        <!-- Filter Bar -->
        <div class="p-4 sm:p-6 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-grow">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search by name or email..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-gold-500 focus:border-gold-500"
                    />
                </div>
                <div class="flex-shrink-0">
                    <select
                        v-model="role"
                        class="w-full sm:w-auto border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-gold-500 focus:border-gold-500"
                    >
                        <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined On</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-800/50 divide-y divide-gray-700">
                    <tr v-if="users.data.length === 0">
                        <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-400">
                            No users found matching your criteria.
                        </td>
                    </tr>
                    <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-700/50 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {{ user.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {{ user.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span v-if="user.is_admin" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300 items-center gap-1">
                                <ShieldCheckIcon class="h-4 w-4" />
                                Admin
                            </span>
                            <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 items-center gap-1">
                                <UserCircleIcon class="h-4 w-4" />
                                User
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {{ formatDate(user.created_at) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="users.links.length > 3" class="p-4 sm:p-6 border-t border-gray-700">
            <Pagination :links="users.links" />
        </div>
    </div>
</template>

```

#### d. Update Admin Sidebar

Finally, let's add a link to the new User Management page in the admin sidebar layout.

```diff
--- a/c:\xampp\htdocs\tapheawards\resources_restored\js\Layouts\AdminLayout.vue
+++ b/c:\xampp\htdocs\tapheawards\resources_restored\js\Layouts\AdminLayout.vue